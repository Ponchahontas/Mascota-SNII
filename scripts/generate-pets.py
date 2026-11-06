#!/usr/bin/env python3
"""Genera sprites originales pixel art, por área y etapa, para la PWA.

Cada área es una especie reconocible. Cada una tiene 14 cuadros de evolución.
Las ilustraciones son ficticias y no representan los criterios oficiales SNII.
Salida: public/pets/<area>.svg, más una hoja de vista previa opcional.
Requiere Pillow solo para regenerar los assets (NO para compilar la app).
"""
from pathlib import Path
import xml.sax.saxutils as xml
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT/'public'/'pets'
OUT.mkdir(exist_ok=True, parents=True)
INK='#303148'; WH='#f6f1e4'; PINK='#f7a0b5'; GOLD='#efc66a'
KINDS={
 'fisico':('Ajolote astral','#91dedf','#50a8c4','#f0a0bd'),
 'biologia':('Zorro de laboratorio','#efb366','#c67f47','#8ec773'),
 'medicina':('Búho sanador','#c5a9da','#846fa5','#92d2d0'),
 'conducta':('Colibrí pedagogo','#f4a982','#cd718e','#83dfb6'),
 'humanidades':('Gato cronista','#b2a1ef','#7b65b5','#f2c477'),
 'sociales':('Capibara comunitaria','#dca277','#aa6b54','#f4cd99'),
 'agro':('Tortuga botánica','#9dd1a4','#5b9f7e','#ead07f'),
 'ingenieria':('Robot ingenioso','#a4bdd9','#5a82aa','#f9cc70'),
 'interdisciplinaria':('Quimera interdisciplinaria','#d6b2ed','#7b8bc6','#f5c373'),
}

def render(area,stage):
 """Dibuja una especie y su etapa en 32x32 px, con fondo transparente.

 La morfología corresponde al área; solo ropa, proporción y accesorios
 cambian al avanzar de etapa. Mantener 14 cuadros por SVG es un contrato
 del selector CSS (ver src/data/pet-visuals.ts).
 """
 im=Image.new('RGBA',(32,32));d=ImageDraw.Draw(im)
 label,main,shadow,accent=KINDS[area]
 # El crecimiento cambia gradualmente la talla de la mascota sin confundir su especie.
 if stage<=3: scale=.82+.03*stage
 elif stage<=6: scale=.95
 else: scale=1.0
 # Dibuja en un lienzo base transparente y escala alrededor del centro al final.
 # Patas / base del cuerpo.
 d.rounded_rectangle((10,19,22,28),radius=3,fill=INK)
 d.rounded_rectangle((11,20,21,27),radius=3,fill=main)
 d.rectangle((10,26,13,29),fill=INK);d.rectangle((19,26,22,29),fill=INK)
 d.rectangle((11,26,13,27),fill=shadow);d.rectangle((19,26,21,27),fill=shadow)
 # Contorno de cabeza y elementos únicos de cada área.
 if area=='fisico':
  for side in (0,1):
   x=4 if side==0 else 25
   for y in (10,14,18):
    d.rectangle((x,y,x+3,y+1),fill=INK);d.rectangle((x+1,y,x+2,y),fill=accent)
  d.rounded_rectangle((7,7,25,22),radius=6,fill=INK)
  d.rounded_rectangle((8,8,24,21),radius=5,fill=main)
  d.rectangle((8,18,11,19),fill=shadow);d.rectangle((21,18,24,19),fill=shadow)
  d.rectangle((15,4,17,7),fill=INK);d.rectangle((16,4,16,6),fill=GOLD)
 elif area=='biologia':
  d.polygon([(7,12),(7,4),(12,7),(15,10)],fill=INK)
  d.polygon([(25,12),(25,4),(20,7),(17,10)],fill=INK)
  d.polygon([(9,10),(9,6),(13,10)],fill=accent)
  d.polygon([(23,10),(23,6),(19,10)],fill=accent)
  d.rounded_rectangle((7,9,25,23),radius=5,fill=INK)
  d.rounded_rectangle((8,10,24,22),radius=4,fill=main)
  d.polygon([(20,22),(28,23),(27,27),(23,26)],fill=INK)
  d.polygon([(21,23),(27,24),(26,26),(23,25)],fill=shadow)
  d.ellipse((12,16,20,23),fill=WH)
 elif area=='medicina':
  d.ellipse((5,16,13,26),fill=INK);d.ellipse((19,16,27,26),fill=INK)
  d.ellipse((6,17,12,25),fill=shadow);d.ellipse((20,17,26,25),fill=shadow)
  d.rounded_rectangle((7,6,25,23),radius=7,fill=INK)
  d.rounded_rectangle((8,7,24,22),radius=6,fill=main)
  d.ellipse((8,11,16,20),fill=WH);d.ellipse((16,11,24,20),fill=WH)
  d.polygon([(14,18),(18,18),(16,21)],fill=GOLD)
  d.polygon([(10,7),(8,4),(14,8)],fill=shadow);d.polygon([(22,7),(24,4),(18,8)],fill=shadow)
 elif area=='conducta':
  # Colibrí: dos alas angulares, cola bifurcada y un pico fino que sobresale.
  # La silueta se diferencia claramente del búho y del zorro a 32 píxeles.
  d.polygon([(8,15),(2,8),(4,18),(10,22)],fill=INK)
  d.polygon([(9,16),(4,11),(6,18),(11,21)],fill=shadow)
  d.polygon([(23,15),(30,7),(29,19),(23,22)],fill=INK)
  d.polygon([(23,16),(28,11),(27,19),(22,21)],fill=accent)
  d.polygon([(13,24),(11,31),(16,27),(21,31),(19,23)],fill=shadow)
  d.ellipse((8,7,23,23),fill=INK)
  d.ellipse((9,8,22,22),fill=main)
  d.polygon([(20,13),(31,11),(21,17)],fill=INK)
  d.polygon([(21,13),(29,12),(21,16)],fill=GOLD)
  d.rectangle((10,11,12,12),fill=accent)
 elif area=='humanidades':
  d.polygon([(7,12),(7,4),(14,9)],fill=INK)
  d.polygon([(25,12),(25,4),(18,9)],fill=INK)
  d.polygon([(9,9),(9,6),(12,9)],fill=accent)
  d.polygon([(23,9),(23,6),(20,9)],fill=accent)
  d.rounded_rectangle((7,9,25,23),radius=5,fill=INK)
  d.rounded_rectangle((8,10,24,22),radius=5,fill=main)
  for y in (17,20):d.line((5,y,11,y+1),fill=INK);d.line((21,y+1,27,y),fill=INK)
  d.line((22,26,27,25,28,21),fill=INK,width=2)
 elif area=='sociales':
  d.ellipse((7,7,12,13),fill=INK);d.ellipse((20,7,25,13),fill=INK)
  d.ellipse((8,8,11,12),fill=shadow);d.ellipse((21,8,24,12),fill=shadow)
  d.rounded_rectangle((6,10,26,23),radius=6,fill=INK)
  d.rounded_rectangle((7,11,25,22),radius=5,fill=main)
  d.rounded_rectangle((11,17,21,23),radius=3,fill=shadow)
  d.rounded_rectangle((12,18,20,22),radius=2,fill=accent)
 elif area=='agro':
  d.ellipse((4,17,28,28),fill=INK);d.ellipse((5,18,27,27),fill=shadow)
  d.polygon([(9,22),(12,16),(20,16),(23,22),(20,26),(12,26)],fill=main)
  d.rectangle((15,8,17,17),fill=INK);d.rectangle((16,8,16,17),fill='#5d9a67')
  d.ellipse((11,5,16,9),fill=accent);d.ellipse((17,3,22,8),fill=accent)
  d.rounded_rectangle((9,12,23,23),radius=5,fill=INK)
  d.rounded_rectangle((10,13,22,22),radius=4,fill=main)
 elif area=='interdisciplinaria':
  # Quimera: una oreja de felino y un cuerno de ajolote, dos lados diferentes.
  # La cola en espiral representa un encuentro de disciplinas.
  d.polygon([(6,13),(6,4),(15,11)],fill=INK)
  d.polygon([(8,11),(8,7),(12,11)],fill=accent)
  d.polygon([(22,10),(25,4),(28,9),(25,14)],fill=INK)
  d.polygon([(23,9),(25,6),(26,10)],fill=GOLD)
  d.rounded_rectangle((6,10,25,23),radius=5,fill=INK)
  d.rounded_rectangle((7,11,24,22),radius=4,fill=main)
  d.rectangle((8,17,12,19),fill=shadow)
  d.ellipse((22,22,31,30),outline=INK,width=2)
  d.ellipse((25,24,29,27),outline=accent,width=2)
  d.rectangle((15,7,17,9),fill=GOLD)
 elif area=='ingenieria':
  d.rectangle((5,12,8,18),fill=INK);d.rectangle((24,12,27,18),fill=INK)
  d.rectangle((12,5,20,8),fill=INK);d.rectangle((15,2,17,6),fill=INK);d.rectangle((15,2,17,3),fill=accent)
  d.rounded_rectangle((7,8,25,23),radius=3,fill=INK)
  d.rounded_rectangle((8,9,24,22),radius=2,fill=main)
  d.rectangle((10,10,22,12),fill=shadow)
 # Ojos propios de cada criatura; se mantienen durante su evolución.
 if area=='medicina':
  d.rectangle((12,15,13,17),fill=INK);d.rectangle((19,15,20,17),fill=INK)
 elif area=='interdisciplinaria':
  # Ojos deliberadamente distintos: refuerzan su identidad híbrida sin
  # redibujar la cabeza y ocultar expresiones de las etapas posteriores.
  d.rectangle((11,14,13,17),fill=INK)
  d.rectangle((19,14,21,17),fill=INK)
  d.point((12,14),fill=WH)
  d.point((20,14),fill=WH)
  d.rectangle((15,19,17,20),fill=shadow)
 elif area=='conducta':
  d.rectangle((14,13,16,16),fill=INK);d.point((15,13),fill=WH)
 elif area=='ingenieria':
  d.rectangle((11,15,14,18),fill=accent);d.rectangle((18,15,21,18),fill=accent)
  d.rectangle((13,20,19,21),fill=shadow)
 else:
  d.rectangle((11,14,13,17),fill=INK);d.rectangle((19,14,21,17),fill=INK)
  d.point((12,14),fill=WH);d.point((20,14),fill=WH)
  if area not in ('agro','sociales','interdisciplinaria'):d.rectangle((15,19,17,20),fill=shadow)
  if area=='sociales':d.point((16,19),fill=INK)
  if area=='agro':d.arc((13,17,19,21),start=0,end=180,fill=INK)
 # Uniforme y accesorios: 14 edades con iconografía y siluetas cambiantes.
 if stage<=1:
  d.rectangle((14,22,18,23),fill=accent)
  d.point((15,23),fill=WH)
  if stage==1:d.rectangle((4,24,8,25),fill=GOLD)
 elif stage<=3:
  # Mochila infantil -> cuaderno de secundaria -> gafas de prácticas técnicas.
  d.rectangle((10,23,22,26),fill='#e9eadb');d.rectangle((14,23,18,25),fill=accent)
  if stage>=2:d.rectangle((24,19,29,24),fill='#d5c18b');d.rectangle((25,20,28,20),fill=INK)
  if stage==3:d.rectangle((10,15,22,16),fill='#d2e8f4');d.rectangle((14,15,18,16),fill=shadow)
 elif stage<=5:
  # Licenciatura y especialidad, chamarra/solapa, acreditación y gafete.
  d.polygon([(11,20),(15,23),(16,25),(17,23),(21,20),(21,27),(11,27)],fill='#f3f5e8')
  d.rectangle((16,23,16,27),fill=shadow)
  if stage>=5:d.rectangle((19,22,21,24),fill=accent)
 elif stage<=8:
  # Posgrado: bata científica con mangas, cambio a gafas, libreta y tesis.
  d.rectangle((9,21,12,27),fill='#f1f5f5');d.rectangle((20,21,23,27),fill='#f1f5f5')
  d.rectangle((12,21,20,28),fill='#f5f2e8');d.rectangle((15,22,17,28),fill=shadow)
  d.rectangle((8,14,24,15),fill='#d0e7f5')
  if stage>=7:d.rectangle((23,23,29,27),fill=accent)
  if stage>=8:d.line((23,22,28,20),fill=WH,width=2)
 elif stage<=12:
  # Acreditaciones ficticias: atuendo investigador, con más insignias al subir de nivel.
  d.rectangle((10,22,22,28),fill='#2f4566');d.rectangle((12,22,20,25),fill='#f6f1e4')
  d.rectangle((16,22,16,28),fill=GOLD)
  for j in range(min(stage-8,4)):
   d.rectangle((10+3*j,25,11+3*j,26),fill=accent)
  if stage>=11:d.rectangle((9,12,23,13),fill=GOLD)
  if stage>=12:d.rectangle((6,20,8,23),fill=GOLD);d.rectangle((24,20,26,23),fill=GOLD)
 else:
  # Emérito: cabello claro / laurel y manto ceremonial.
  d.rectangle((10,21,22,28),fill='#eceee8');d.rectangle((13,21,19,28),fill='#74849e')
  d.polygon([(9,7),(12,4),(14,6),(16,3),(18,6),(21,4),(23,7)],fill=GOLD)
  d.point((5,6),fill=GOLD);d.point((27,8),fill=GOLD);d.point((5,22),fill=WH)
 # Gradúa la talla en primeras etapas conservando el centro.
 if scale<1:
  size=round(32*scale)
  scaled=im.resize((size,size),Image.Resampling.NEAREST)
  grown=Image.new('RGBA',(32,32))
  grown.alpha_composite(scaled,((32-size)//2,32-size))
  im=grown
 return im


def make():
 preview=Image.new('RGB',(14*70+155,len(KINDS)*78+65),'#20263b')
 draw=ImageDraw.Draw(preview)
 draw.text((120,8),'EVOLUCION DE MASCOTAS POR AREA / 14 ETAPAS',fill='white')
 for i in range(14):draw.text((120+i*70,35),f'{i+1}',fill='#b8c7ed')
 for row,(area,(name,*_)) in enumerate(KINDS.items()):
  y=55+row*78
  draw.text((4,y+23),name[:15],fill='#dce8fe')
  frames=[]
  for stage in range(14):
   im=render(area,stage);frames.append(im)
   panel=im.resize((64,64),Image.Resampling.NEAREST)
   preview.paste(panel,(120+stage*70,y),panel)
  # Codifica cada fila mediante rectángulos consecutivos del mismo tono.
  # Así el SVG es 100 % vectorial, auto-contenido y compatible con CSP estricta.
  paths={}
  for frame_index,im in enumerate(frames):
   for y in range(32):
    x=0
    while x<32:
     color=im.getpixel((x,y))
     if color[3]<100:
      x+=1;continue
     width=1
     while x+width<32 and im.getpixel((x+width,y))==color:width+=1
     key='#%02x%02x%02x'%color[:3]
     paths.setdefault(key,[]).append(f'M{frame_index*32+x} {y}h{width}v1h-{width}z')
     x+=width
  svg=['<svg xmlns="http://www.w3.org/2000/svg" width="448" height="32" viewBox="0 0 448 32" shape-rendering="crispEdges">',f'<title>{xml.escape(name)}: 14 etapas</title>']
  for color,subpaths in paths.items():svg.append(f'<path fill="{color}" d="{" ".join(subpaths)}"/>')
  svg.append('</svg>')
  (OUT/f'{area}.svg').write_text('\n'.join(svg),encoding='utf-8')
 preview.save(ROOT/'docs'/'preview-126-evoluciones.png')
 print('Especies:',len(KINDS),'· Variantes de evolución:',len(KINDS)*14)
 print('Vista previa: docs/preview-126-evoluciones.png')

if __name__=='__main__':make()
