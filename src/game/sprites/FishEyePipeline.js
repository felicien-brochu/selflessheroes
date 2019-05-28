import Phaser from 'phaser'

export default class FishEyePipeline extends Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline {
  constructor(game) {
    super({
      game: game,
      renderer: game.renderer,
      fragShader: `
precision mediump float;
uniform sampler2D uMainSampler;
varying vec2 outTexCoord;
const float PI = 3.1415926535;

void main()
{
  float aperture = 130.0;
  float apertureHalf = 0.5 * aperture * (PI / 180.0);
  float maxFactor = sin(apertureHalf) + 0.4;

  vec2 uv;
  vec2 xy = 2.0 * outTexCoord.xy - 1.0;
  float d = length(xy);
  if (d < (2.0-maxFactor))
  {
    d = length(xy * maxFactor);
    float z = sqrt(1.0 - d * d);
    float r = atan(d, z) / PI;
    float phi = atan(xy.y, xy.x);

    uv.x = r * cos(phi) + 0.5;
    uv.y = r * sin(phi) + 0.5;
  }
  else
  {
    uv = outTexCoord.xy;
  }
  vec4 c = texture2D(uMainSampler, uv);
  gl_FragColor = c;
}`
    })
  }
}