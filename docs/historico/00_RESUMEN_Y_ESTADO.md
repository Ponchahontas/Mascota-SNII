# Resumen ejecutivo y estado actual

## Concepto
Academic Pet es un juego satírico de progresión académica. La mascota evoluciona a través de etapas educativas y académicas, afrontando necesidades, actividades, proyectos, eventos, recursos, herramientas, evaluaciones ficticias y burocracia.

## Etapas
1. Kínder
2. Primaria
3. Secundaria
4. Preparatoria + certificación técnica
5. Universidad
6. Especialidad
7. Maestría
8. Doctorado
9. Posdoctorado
10. Candidato SNII
11. Nivel I
12. Nivel II
13. Nivel III
14. Emérito

Las etapas son una progresión de videojuego. No equivalen automáticamente a los requisitos oficiales de grados o reconocimientos.

## Decisiones tomadas
- Pixel art y humor satírico, centrado en la experiencia académica y burocrática.
- Bucle mixto clicker/idle con cadenas de acciones satisfactorias.
- Cuidado accesible: comer, descansar, dormir, socializar y recreación no consumen PA.
- Recursos ficticios: PA (puntos de acción), CR (créditos), PE (progreso de proyecto) y UPE (unidades de progreso de etapa).
- Proyectos de varias fases y evidencias con trazabilidad.
- Automatizaciones limitadas; no generan publicaciones o reconocimientos de la nada.
- Progreso offline máximo de ocho horas, sin decisiones importantes automáticas ni deterioro ilimitado.
- Guardado local, exportación/importación, migraciones versionadas y PWA.
- Legado y generaciones sin final obligatorio.
- Preparación para GitHub y despliegue estático en Netlify.
- Todavía no existe una implementación completa; las cifras de balance no se han validado por simulación.

## Necesidades
Escala orientativa 0–100: energía, motivación, concentración, bienestar, estrés, curiosidad, competencia, socialización e integridad científica. Definir rangos y efectos finales antes de implementar.

## Fórmulas propuestas (por balancear)
- Rendimiento: P = B × E × C × M × R(n) × Q.
- Rendimientos decrecientes: R(n) = max(0.55, 1 - 0.09 × (n - 1)).
- Coste final de PA: redondeo hacia arriba de PA base × multiplicador de coste.
- PE final: PE base × multiplicador de recompensa × factores de estado, habilidad, preparación, repetición y combo.
- Automatizaciones: A efectiva = 1 - producto(1 - a_i); factor automático = 1 + 0.25 × A efectiva.
- Contribución individual de automatización limitada a 0.20 y descuento combinado de coste máximo de 50%.

Todas son hipótesis de diseño. Deben probarse y balancearse; no tratarlas como fórmulas ya validadas.

## Progreso offline inicial
Máximo 8 horas:
- Kínder–Secundaria: recuperación/eventos, sin producción académica automática.
- Preparatoria técnica: eficiencia orientativa 10%.
- Universidad–Especialidad: 15%.
- Maestría–Doctorado: 20%.
- Posdoctorado–Candidato SNII: 25%.
- Nivel I–II: 30%.
- Nivel III–Emérito: 35%.
No ejecutar decisiones importantes automáticamente ni aplicar deterioro ilimitado.

## Economía
CR se obtiene por retos, encargos, proyectos, hitos y legado. Se gasta en materiales, equipo, mantenimiento y herramientas. No se pueden comprar artículos académicos, niveles ni reconocimientos. Si una automatización no puede pagarse, se pausa.

## Duración objetivo por etapa (no validada)
- Kínder: 10–20 min
- Primaria: 20–35 min
- Secundaria: 30–50 min
- Prepa técnica: 45–70 min
- Universidad: 60–100 min
- Especialidad: 75–120 min
- Maestría: 90–150 min
- Doctorado: 120–200 min
- Posdoctorado: 100–180 min
- Candidato SNII: 100–180 min
- Nivel I: 120–220 min
- Nivel II: 150–260 min
- Nivel III: 180–320 min
- Emérito: modo continuo

## Estado
- Diseño conceptual: definido a nivel inicial.
- Contratos de módulos: definidos conceptualmente.
- Catálogo de comandos: definido a nivel de especificación.
- Código jugable: pendiente.
- Balance por simulación: pendiente.
- Validación normativa documental: pendiente de revisión vigente.
- Pruebas automatizadas: pendientes.
- GitHub/Netlify: no desplegado por este paquete.
