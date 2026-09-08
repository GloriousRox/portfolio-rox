$files=Get-ChildItem (Join-Path $PSScriptRoot 'images\Screenshot *.png') | Sort-Object Name
$w=1600;$cell=146;$gap=14;$cols=10;$rows=[math]::Ceiling($files.Count/$cols);$header=250;$h=$header+($rows*($cell+$gap))+70
$items=for($i=0;$i -lt $files.Count;$i++){ $x=60+(($i%$cols)*($cell+$gap));$y=$header+([math]::Floor($i/$cols)*($cell+$gap));$b=[Convert]::ToBase64String([IO.File]::ReadAllBytes($files[$i].FullName)); "<rect x='$x' y='$y' width='$cell' height='$cell' rx='12' fill='#28242f'/><image href='data:image/png;base64,$b' x='$x' y='$y' width='$cell' height='$cell' preserveAspectRatio='xMidYMid meet' clip-path='inset(0 round 12)'/>" }
$svg=@"
<svg xmlns='http://www.w3.org/2000/svg' width='$w' height='$h' viewBox='0 0 $w $h'>
<rect width='$w' height='$h' fill='#17151c'/><circle cx='1460' cy='70' r='230' fill='#8565ef' opacity='.25'/><circle cx='80' cy='$h' r='260' fill='#d8ff59' opacity='.12'/>
<text x='60' y='76' fill='#d8ff59' font-family='Arial,sans-serif' font-size='24' font-weight='700' letter-spacing='5'>ATEEQ / 3D</text><text x='60' y='158' fill='#f6f3ed' font-family='Arial,sans-serif' font-size='64' font-weight='700'>ROBLOX MODELING</text><text x='60' y='220' fill='#8565ef' font-family='Arial,sans-serif' font-size='64' font-weight='700'>PORTFOLIO</text><text x='1280' y='160' fill='#d8ff59' font-family='monospace' font-size='16'>86 SINGLE-MODEL STUDIES</text>
$($items -join "`n")
<text x='60' y='$($h-25)' fill='#aaa3b7' font-family='monospace' font-size='15'>CHARACTERS  ·  PROPS  ·  ENVIRONMENTS  ·  GAME-READY ASSETS</text><text x='1400' y='$($h-25)' fill='#d8ff59' font-family='monospace' font-size='15'>2026</text></svg>
"@
Set-Content (Join-Path $PSScriptRoot 'portfolio-card.svg') $svg -Encoding utf8
