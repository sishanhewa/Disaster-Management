const fs = require('fs');

const f1 = 'C:/catacolite/climasphere/frontend/src/components/map/FloodDashboardPanel.tsx';
const f2 = 'C:/catacolite/climasphere/frontend/src/components/map/ArcGISVectorLayers.tsx';
const f3 = 'C:/catacolite/climasphere/frontend/src/components/map/DynamicLiveMiniMap.tsx';

[f1, f2, f3].forEach(f => {
  if (fs.existsSync(f)) {
    let content = fs.readFileSync(f, 'utf8');

    content = content.replace(/import \{ useTheme \} from 'next-themes';\n/g, '');
    content = content.replace(/const \{ theme \} = useTheme\(\);/g, '');
    content = content.replace(/const isLight = theme === 'light';/g, '');
    content = content.replace(/const isLight = false;/g, '');
    
    // Replace inline ternary isLight checks with the dark mode value
    content = content.replace(/\$\{isLight \? '[^']+' : '([^']+)'\}/g, '$1');
    content = content.replace(/isLight \? '[^']+' : '([^']+)'/g, "'$1'");

    // For FloodDashboardPanel
    content = content.replace(/const styles = isLight \? LEVEL_STYLES_LIGHT : LEVEL_STYLES;/g, 'const styles = LEVEL_STYLES;');
    
    // For DynamicLiveMiniMap
    content = content.replace(/bg-slate-100 dark:bg-slate-900/g, 'bg-slate-900');

    fs.writeFileSync(f, content, 'utf8');
  }
});
