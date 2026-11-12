import { onVisit } from '~/scripts/visit'

// A horde of comets crossing the empty side of the hero, each at its own
// depth, so the near ones read wider, brighter, and faster than the far ones.

const VERTEX = `
attribute vec2 position;
void main() { gl_Position = vec4(position, 0.0, 1.0); }
`

const HEADER = `
precision highp float;
uniform vec2 resolution;
uniform vec2 pointer;
uniform float time;
const vec3 lavender = vec3(0.706, 0.745, 0.996);
const vec3 mauve = vec3(0.796, 0.651, 0.969);
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
`

const FRAGMENT = `
void main() {
  vec2 aspect = vec2(resolution.x / resolution.y, 1.0);
  vec2 uv = gl_FragCoord.xy / resolution;
  vec2 q = uv * aspect;
  vec3 color = vec3(0.0);
  float alpha = 0.0;
  // the whole group travels together, and each comet runs ahead or behind it
  float group = 0.18 * sin(time * 0.35);
  // the cursor pans the view: near comets shift more than far ones
  vec2 pan = (clamp(pointer, -0.5, 1.5) - 0.5) * vec2(0.08, 0.1);
  for (int i = 0; i < 12; i++) {
    float k = float(i);
    vec2 dir = vec2(1.0, 0.0);
    // fixed depth, 0 far and 1 near: by parallax a near comet is wider, brighter, and moves faster
    float depth = hash(vec2(k * 3.7, 9.0));
    float scale = mix(0.45, 1.0, depth);
    float drift = 0.12 * sin(time * (0.15 + hash(vec2(k, 6.0)) * 0.2) + k * 1.7);
    float lane = 0.2 + hash(vec2(k * 7.7, 3.1)) * 0.6 + drift + pan.y * scale;
    float rate = (0.5 + hash(vec2(k, 4.0)) * 0.6) * scale;
    float phase = time * rate + k * 2.3;
    float sway = (group + 0.1 * sin(phase)) * scale;
    // forward speed stretches the tail; a comet easing back keeps a short one
    float speed = max(cos(phase) * 0.5 + cos(time * 0.35), 0.0);
    float span = (0.25 + hash(vec2(k, 3.0)) * 0.3 + speed * 0.35) * scale * aspect.x;
    vec2 head = vec2((0.6 + hash(vec2(k * 17.3, 41.9)) * 0.2 + sway + pan.x * scale) * aspect.x, lane);
    vec2 rel = q - head;
    float along = -dot(rel, dir);
    float across = abs(dot(rel, vec2(-dir.y, dir.x))) * resolution.y / scale;
    float tail = step(0.0, along) * pow(1.0 - smoothstep(0.0, span, along), 1.5);
    float width = 1.0 / (across * across * 0.8 + 1.0);
    float glow = 1.0 / (pow(length(rel) * resolution.y * 0.3 / scale, 2.0) + 1.0);
    float streak = (tail * width * 1.3 + glow * 1.2) * mix(0.35, 1.0, depth);
    color += mix(mauve, lavender, tail) * streak;
    alpha += streak;
  }
  float edge = 1.0 - smoothstep(0.35, 0.5, max(abs(uv.x - 0.5), abs(uv.y - 0.5)));
  gl_FragColor = vec4(clamp(color * edge, 0.0, 1.0), clamp(alpha * edge, 0.0, 1.0));
}
`

const compile = (gl: WebGLRenderingContext, type: number, source: string) => {
  const shader = gl.createShader(type)
  if (!shader) return null
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(shader))
    return null
  }
  return shader
}

export const bindHeroFx = () => {
  const canvas = document.querySelector<HTMLCanvasElement>('[data-hero-fx]')
  const hero = canvas?.closest('section')
  if (!canvas || !hero) return

  const gl = canvas.getContext('webgl', { premultipliedAlpha: true })
  if (!gl) return

  const vertex = compile(gl, gl.VERTEX_SHADER, VERTEX)
  const fragment = compile(gl, gl.FRAGMENT_SHADER, HEADER + FRAGMENT)
  const program = gl.createProgram()
  if (!vertex || !fragment || !program) return
  gl.attachShader(program, vertex)
  gl.attachShader(program, fragment)
  gl.linkProgram(program)
  // biome-ignore lint/correctness/useHookAtTopLevel: WebGL call, not a React hook
  gl.useProgram(program)

  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
    gl.STATIC_DRAW,
  )
  const position = gl.getAttribLocation(program, 'position')
  gl.enableVertexAttribArray(position)
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)

  const resolution = gl.getUniformLocation(program, 'resolution')
  const pointerAt = gl.getUniformLocation(program, 'pointer')
  const timeAt = gl.getUniformLocation(program, 'time')

  const pointer = { x: 0.5, y: 0.5 }
  const target = { x: 0.5, y: 0.5 }

  const resize = () => {
    const scale = Math.min(window.devicePixelRatio, 1.5)
    canvas.width = Math.round(canvas.clientWidth * scale)
    canvas.height = Math.round(canvas.clientHeight * scale)
    gl.viewport(0, 0, canvas.width, canvas.height)
    gl.uniform2f(resolution, canvas.width, canvas.height)
  }

  const follow = (event: PointerEvent) => {
    const box = canvas.getBoundingClientRect()
    target.x = (event.clientX - box.left) / box.width
    target.y = 1 - (event.clientY - box.top) / box.height
  }

  const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const start = performance.now()
  let frame = 0
  let visible = true

  const draw = () => {
    pointer.x += (target.x - pointer.x) * 0.05
    pointer.y += (target.y - pointer.y) * 0.05
    gl.uniform2f(pointerAt, pointer.x, pointer.y)
    gl.uniform1f(timeAt, (performance.now() - start) / 1000)
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
    if (!still && visible) frame = requestAnimationFrame(draw)
  }

  const observer = new IntersectionObserver(([entry]) => {
    visible = entry?.isIntersecting ?? false
    cancelAnimationFrame(frame)
    if (visible) frame = requestAnimationFrame(draw)
  })

  resize()
  window.addEventListener('resize', resize)
  hero.addEventListener('pointermove', follow)
  observer.observe(canvas)

  return () => {
    cancelAnimationFrame(frame)
    observer.disconnect()
    window.removeEventListener('resize', resize)
    hero.removeEventListener('pointermove', follow)
  }
}

onVisit(bindHeroFx)
