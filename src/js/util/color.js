//color.js
var Color = function() {


    return {
      RGBtoHSV: function(r, g, b, coneModel) {
        var h, // 0..360
        s, v, // 0..255
        max = Math.max(Math.max(r, g), b),
          min = Math.min(Math.min(r, g), b);

        // hue
        if (max == min) {
          h = 0; // 0
        } else if (max == r) {
          h = 60 * (g - b) / (max - min) + 0;
        } else if (max == g) {
          h = (60 * (b - r) / (max - min)) + 120;
        } else {
          h = (60 * (r - g) / (max - min)) + 240;
        }

        while (h < 0) {
          h += 360;
        }

        // saturation
        if (coneModel) {
          // ensui
          s = max - min;
        } else {
          s = (max === 0) ? 0 
          : (max - min) / max * 255;
        }

        // value
        v = max;

        return {
          'h': h,
          's': s,
          'v': v
        };
      },
      HSVtoRGB: function(h, s, v) {
        var r, g, b; // 0..255
        while (h < 0) {
          h += 360;
        }

        h = h % 360;

        // saturation = 0
        if (s === 0) {
          // RGB= V 
          v = Math.round(v);
          return {
            'r': v,
            'g': v,
            'b': v
          };
        }

        s = s / 255;

        var i = Math.floor(h / 60) % 6,
          f = (h / 60) - i,
          p = v * (1 - s),
          q = v * (1 - f * s),
          t = v * (1 - (1 - f) * s);

          switch (i) {
          case 0:
            r = v;
            g = t;
            b = p;
            break;
          case 1:
            r = q;
            g = v;
            b = p;
            break;
          case 2:
            r = p;
            g = v;
            b = t;
            break;
          case 3:
            r = p;
            g = q;
            b = v;
            break;
          case 4:
            r = t;
            g = p;
            b = v;
            break;
          case 5:
            r = v;
            g = p;
            b = q;
            break;
          }

        return {
          'r': Math.round(r),
          'g': Math.round(g),
          'b': Math.round(b)
        };
      }


    };
  };