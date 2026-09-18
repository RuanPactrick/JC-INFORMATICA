<<<<<<< HEAD
# JC Informática — starter de dados do novo site

Este pacote foi gerado a partir do catálogo Vendizap capturado em 2026-09-17T21:59:42.411Z.

## Resumo
- 43 registros válidos no scraper
- 42 produtos normalizados após juntar a promoção/registro regular da RX 6900 XT
- 8 categorias derivadas do catálogo atual
- 42 produtos com imagem local mapeada
- 74 imagens de produto detectadas no DOM/CDN no total

## Arquivos
- `products.json`: catálogo normalizado para o frontend
- `categories.json`: categorias + produto representativo
- `homepage.json`: conteúdo e curadoria inicial da homepage
- `asset-manifest.json`: origem -> destino dos arquivos de imagem
- `prepare-site-assets.mjs`: copia/renomeia os assets no projeto

## Como preparar o projeto

No terminal:

```bat
node prepare-site-assets.mjs "C:\Users\SEU_USUARIO\Downloads\jc-vendizap-scraper-api" "C:\CAMINHO\DO\NOVO-SITE"
```

O script cria:

```text
novo-site/
├─ public/
│  └─ images/
│     └─ products/
└─ src/
   └─ data/
      ├─ products.json
      ├─ categories.json
      └─ homepage.json
```

## Observação importante
O catálogo ainda contém URLs de imagens de produto vistas no DOM que não foram associadas a um card com nome/preço. Isso não bloqueia a primeira versão do site; o conjunto normalizado já é suficiente para construir a homepage e as primeiras categorias.
=======
# JC-INFORM-TICA
a
>>>>>>> aab03fd4c7e90ad30dcec0886ecc00039c690b7c
