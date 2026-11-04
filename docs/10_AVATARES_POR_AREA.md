# Mascotas por área y las 14 etapas (MVP 0.3)

## Estado implementado

Los carteles de pixel art elaborados previamente son **referencias visuales**, no sprites individuales.
El juego ahora contiene siete especies originales y 98 cuadros vectoriales (14 por especie), con evolución visible desde Kínder hasta SNII Emérito.

| Área temática ilustrativa | Mascota y rasgos |
|---|---|
| Físico-matemáticas y Tierra | Ajolote astral, branquias y antena estelar |
| Biología y Química | Zorro de laboratorio, orejas y cola |
| Medicina y Salud | Búho sanador, discos faciales y alas |
| Humanidades | Gato cronista, orejas y bigotes |
| Ciencias Sociales | Capibara comunitaria, orejas y hocico redondo |
| Biotecnología y Agro | Tortuga botánica, caparazón y brote |
| Ingenierías | Robot ingenioso, visor y antena |

Cada sprite SVG contiene 14 cuadros de 32×32 px dispuestos horizontalmente. La hoja se presenta mediante `background-size: 1400% 100%` y `background-position: <n / 13 * 100>% 0`; toda la animación es CSS y respeta `prefers-reduced-motion`. Para nuevos sprites, edita `scripts/generate-pets.py` y regenera con Pillow.

**No hay 98 animaciones de acciones complejas**, sino 98 apariencias estáticas evolutivas con flotación básica. La futura versión deberá añadir poses, reacciones, accesorios por actividad, expresiones del estado vital y ciclos de movimiento por especie.

## Evolución propuesta

- 1–4: atuendo infantil, escuela, prepa técnica; proporción pequeña que crece.
- 5–6: indumentaria universitaria y prácticas de especialidad.
- 7–9: bata, gafas y cuaderno de investigación.
- 10–13: insignias crecientes del personal investigador, sin emular distintivos oficiales.
- 14: laurel y atuendo ceremonial.

El usuario puede escoger la especie desde la pantalla inicial y cambiar la especie visual de una partida existente en **Datos**. Las reglas académicas, los puntajes y las áreas son ficticios; no hay validación normativa oficial.
