# Amora — landing de lancement

Landing page Next.js / React pour le parfum Amora. Le flacon 3D reste fixé à l’écran tandis que sa rotation suit la progression du scroll. Une bouteille de secours en Three.js est affichée tant que `parfum.glb` n’est pas présent ; le fichier fourni peut être placé dans `public/parfum.glb` pour le charger automatiquement.

## Lancer

```bash
npm install
npm run dev
```

Le projet utilise Next.js, React, Tailwind CSS, Framer Motion, Three.js / React Three Fiber et Lucide. Une fois le GLB ajouté, ajuster sa taille/position dans `Bottle` si son échelle diffère de celle attendue.
