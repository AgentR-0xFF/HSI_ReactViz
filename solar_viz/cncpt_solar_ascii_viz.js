import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { PlayCircle, PauseCircle, SkipForward, SkipBack } from 'lucide-react';

const CANVAS = {
  WIDTH: 80,
  HEIGHT: 40,
  HORIZON_Y: 38,
  HOUR_WIDTH: 3.3333
};

const ASTRONOMICAL = {
  OBLIQUITY: 23.439281,
  REF_YEAR: 2000,
  SOLAR_NOON: 12,
  REF_LONGITUDE: 4.9,    // Amsterdam
  REFRACTION: 0.833,
};

const HORIZONS = {
  ASTRONOMICAL: -18,
  NAUTICAL: -12,
  CIVIL: -6,
  VISIBLE: 0
};

const CHARS = {
  SKY: ' .·:+*✧✦★✵✸✹✺✷',
  HORIZON: {
    VISIBLE: '═',
    CIVIL: '─',
    NAUTICAL: '·',
    ASTRONOMICAL: '.'
  },
  SUN: {
    ABOVE: ['◉', '☀', '●', '◕'],
    HORIZON: ['◐', '○', '◑'],
    TWILIGHT: {
      CIVIL: ['◔', '∘'],
      NAUTICAL: ['·', '·'],
      ASTRONOMICAL: ['.', ' ']
    }
  }
};

// Utility functions
const toRad = (deg) => deg * Math.PI / 180;
const toDeg = (rad) => rad * 180 / Math.PI;

const SolarAsciiViz = () => {
  // State
  const [latitude, setLatitude] = useState(52);
  const [day, setDay] = useState(175);
  const [currentHour, setCurrentHour] = useState(12);
  const [frame, setFrame] = useState([]);
  const [isPlaying, setIsPlaying] = useState(true);
  const [timeSpeed, setTimeSpeed] = useState(1);
  const [solarInfo, setSolarInfo] = useState({});

  // Solar calculations
  const getEquationOfTime = useCallback((dayOfYear) => {
    const B = 2 * Math.PI * (dayOfYear - 81) / 365;
    return 9.87 * Math.sin(2*B) - 7.53 * Math.cos(B) - 1.5 * Math.sin(B);
  }, []);

  const getSolarDeclination = useCallback((dayOfYear) => {
    const D = 2 * Math.PI * (dayOfYear - 1) / 365;
    return Math.asin(
      Math.sin(toRad(ASTRONOMICAL.OBLIQUITY)) * Math.sin(D)
    );
  }, []);

  const calculateSolarPosition = useCallback((hour, latitude, dayOfYear) => {
    const latRad = toRad(latitude);
    const declination = getSolarDeclination(dayOfYear);
    const eqTime = getEquationOfTime(dayOfYear);
    const solarTime = hour + eqTime/60;
    const hourAngle = toRad((solarTime - ASTRONOMICAL.SOLAR_NOON) * 15);

    const sinAlt = Math.sin(latRad) * Math.sin(declination) +
                   Math.cos(latRad) * Math.cos(declination) * Math.cos(hourAngle);
    const altitude = toDeg(Math.asin(sinAlt));

    let azimuth = toDeg(Math.acos(
      (Math.sin(declination) - Math.sin(latRad) * sinAlt) /
      (Math.cos(latRad) * Math.cos(Math.asin(sinAlt)))
    ));
    if (hour > 12) azimuth = 360 - azimuth;

    const cosH = -Math.tan(latRad) * Math.tan(declination);
    let daylightHours, sunrise, sunset;

    if (cosH < -1) {
      daylightHours = 24;
      sunrise = 0;
      sunset = 24;
    } else if (cosH > 1) {
      daylightHours = 0;
      sunrise = 12;
      sunset = 12;
    } else {
      const H = Math.acos(cosH);
      daylightHours = 24 * H / (2 * Math.PI);
      
      const timeDiff = toDeg(H) / 15;
      sunrise = ASTRONOMICAL.SOLAR_NOON - timeDiff - eqTime/60;
      sunset = ASTRONOMICAL.SOLAR_NOON + timeDiff - eqTime/60;
      
      const timeZoneOffset = -ASTRONOMICAL.REF_LONGITUDE / 15;
      sunrise += timeZoneOffset;
      sunset += timeZoneOffset;
    }

    return {
      altitude,
      azimuth,
      daylightHours,
      sunrise,
      sunset,
      twilight: {
        civil: altitude > HORIZONS.CIVIL,
        nautical: altitude > HORIZONS.NAUTICAL,
        astronomical: altitude > HORIZONS.ASTRONOMICAL
      }
    };
  }, [getEquationOfTime, getSolarDeclination]);

  const getSunChar = useCallback((altitude) => {
    if (altitude > HORIZONS.VISIBLE) {
      const index = Math.min(Math.floor(altitude / 15), CHARS.SUN.ABOVE.length - 1);
      return CHARS.SUN.ABOVE[index];
    } else if (altitude > HORIZONS.CIVIL) {
      const index = Math.floor((altitude - HORIZONS.CIVIL) / 2);
      return CHARS.SUN.HORIZON[Math.min(index, CHARS.SUN.HORIZON.length - 1)];
    } else if (altitude > HORIZONS.NAUTICAL) {
      return CHARS.SUN.TWILIGHT.CIVIL[0];
    } else if (altitude > HORIZONS.ASTRONOMICAL) {
      return CHARS.SUN.TWILIGHT.NAUTICAL[0];
    }
    return CHARS.SUN.TWILIGHT.ASTRONOMICAL[0];
  }, []);

  const altitudeToY = useCallback((altitude) => {
    const usableHeight = CANVAS.HORIZON_Y - 4;
    return CANVAS.HORIZON_Y - 4 - Math.floor(((altitude + 90) / 180) * usableHeight);
  }, []);

  const createTimeScale = useCallback(() => {
    const hourMarks = Array(CANVAS.WIDTH).fill(' ');
    const timeMarks = Array(CANVAS.WIDTH).fill('─');
    
    for (let hour = 0; hour < 24; hour++) {
      const pos = Math.floor(hour * CANVAS.HOUR_WIDTH);
      const hourStr = hour.toString().padStart(2, '0');
      
      if (pos + 1 < CANVAS.WIDTH) {
        hourMarks[pos] = hourStr[0];
        hourMarks[pos + 1] = hourStr[1];
        timeMarks[pos] = '┴';
      }
    }
    
    timeMarks[CANVAS.WIDTH - 1] = '┘';
    return [hourMarks, timeMarks];
  }, []);

  const renderFrame = useCallback(() => {
    const matrix = Array(CANVAS.HEIGHT).fill().map(() => Array(CANVAS.WIDTH).fill(' '));
    const info = calculateSolarPosition(currentHour, latitude, day);
    setSolarInfo(info);

    // Draw horizon lines
    const visibleY = altitudeToY(HORIZONS.VISIBLE);
    const civilY = altitudeToY(HORIZONS.CIVIL);
    const nauticalY = altitudeToY(HORIZONS.NAUTICAL);
    const astronomicalY = altitudeToY(HORIZONS.ASTRONOMICAL);

    matrix[visibleY].fill(CHARS.HORIZON.VISIBLE);
    matrix[civilY].fill(CHARS.HORIZON.CIVIL);
    matrix[nauticalY].fill(CHARS.HORIZON.NAUTICAL);
    matrix[astronomicalY].fill(CHARS.HORIZON.ASTRONOMICAL);

    // Calculate sun position
    const sunX = Math.floor((info.azimuth / 360) * CANVAS.WIDTH);
    const sunY = altitudeToY(info.altitude);

    // Fill sky and gradient
    for (let y = 0; y < CANVAS.HORIZON_Y - 2; y++) {
      for (let x = 0; x < CANVAS.WIDTH; x++) {
        if ([visibleY, civilY, nauticalY, astronomicalY].includes(y)) {
          continue;
        }

        const dist = Math.sqrt(Math.pow(x - sunX, 2) + Math.pow(y - sunY, 2));
        
        if (x === sunX && y === sunY) {
          matrix[y][x] = getSunChar(info.altitude);
          continue;
        }

        let charIndex;
        if (info.twilight.civil) {
          charIndex = Math.min(Math.floor(dist / 3), CHARS.SKY.length - 1);
        } else {
          charIndex = Math.min(Math.floor(dist / 2), CHARS.SKY.length - 1);
        }
        matrix[y][x] = CHARS.SKY[charIndex];
      }
    }

    // Add time scale
    const [hourScale, markScale] = createTimeScale();
    matrix[CANVAS.HORIZON_Y] = hourScale;
    matrix[CANVAS.HORIZON_Y + 1] = markScale;

    return matrix;
  }, [currentHour, latitude, day, calculateSolarPosition, getSunChar, createTimeScale, altitudeToY]);

  const stepTime = (amount) => {
    setCurrentHour(prev => {
      let newHour = prev + amount;
      if (newHour >= 24) newHour = 0;
      if (newHour < 0) newHour = 23.9;
      return newHour;
    });
  };

  useEffect(() => {
    let timer;
    if (isPlaying) {
      timer = setInterval(() => {
        stepTime(0.1 * timeSpeed);
      }, 100);
    }
    return () => clearInterval(timer);
  }, [isPlaying, timeSpeed]);

  useEffect(() => {
    setFrame(renderFrame());
  }, [renderFrame]);

  const formatTime = (hours) => {
    const h = Math.floor(hours);
    const m = Math.floor((hours - h) * 60);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Solar Position (Accurate Model)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-2">
                Latitude: {latitude.toFixed(1)}°
              </label>
              <Slider
                value={[latitude]}
                onValueChange={(val) => setLatitude(val[0])}
                min={-90}
                max={90}
                step={1}
              />
            </div>
            <div>
              <label className="block text-sm mb-2">
                Day: {day} ({solarInfo.daylightHours?.toFixed(1)}h daylight)
              </label>
              <Slider
                value={[day]}
                onValueChange={(val) => setDay(val[0])}
                min={1}
                max={365}
                step={1}
              />
            </div>
          </div>

          <div className="flex items-center justify-between space-x-4">
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => stepTime(-1)}
              >
                <SkipBack className="h-4 w-4" />
              </Button>
              
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? 
                  <PauseCircle className="h-4 w-4" /> : 
                  <PlayCircle className="h-4 w-4" />
                }
              </Button>

              <Button 
                variant="outline" 
                size="icon"
                onClick={() => stepTime(1)}
              >
                <SkipForward className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex-1 max-w-xs">
              <label className="block text-sm mb-2">
                Speed: {timeSpeed.toFixed(1)}x
              </label>
              <Slider
                value={[timeSpeed]}
                onValueChange={(val) => setTimeSpeed(val[0])}
                min={0.1}
                max={5}
                step={0.1}
              />
            </div>

            <div className="text-sm space-y-1">
              <div>Time: {formatTime(currentHour)}</div>
              <div>Sunrise: {formatTime(solarInfo.sunrise)}</div>
              <div>Sunset: {formatTime(solarInfo.sunset)}</div>
            </div>
          </div>

          <div className="relative">
            <pre 
              className="font-mono text-xs leading-none whitespace-pre p-4 bg-black text-amber-500 rounded-lg overflow-hidden border-2 border-amber-800"
              style={{ 
                letterSpacing: '0',
                lineHeight: '1.2em'
              }}
            >
              {frame.map((row, i) => (
                <div key={i}>{row.join('')}</div>
              ))}
            </pre>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SolarAsciiViz;
