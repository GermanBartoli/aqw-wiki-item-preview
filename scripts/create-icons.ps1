$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
$assets = Join-Path $PSScriptRoot '..\assets'
New-Item -ItemType Directory -Force -Path $assets | Out-Null
foreach ($size in 16, 48, 128) {
    $bitmap = [System.Drawing.Bitmap]::new($size, $size)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.SmoothingMode = 'AntiAlias'
    $graphics.TextRenderingHint = 'AntiAliasGridFit'
    $graphics.Clear([System.Drawing.Color]::FromArgb(24, 25, 35))
    $gold = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(238, 183, 74))
    $red = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(168, 20, 34))
    $graphics.FillRectangle($gold, 0, 0, $size, [Math]::Max(2, [int]($size / 12)))
    $graphics.FillEllipse($red, $size * 0.12, $size * 0.18, $size * 0.76, $size * 0.68)
    $font = [System.Drawing.Font]::new('Arial', [Math]::Max(8, $size * 0.24), [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
    $text = if ($size -eq 16) { 'A' } else { 'AQW' }
    $format = [System.Drawing.StringFormat]::new()
    $format.Alignment = 'Center'
    $format.LineAlignment = 'Center'
    $rectangle = [System.Drawing.RectangleF]::new(0, 0, $size, $size)
    $graphics.DrawString($text, $font, [System.Drawing.Brushes]::White, $rectangle, $format)
    $bitmap.Save((Join-Path $assets "icon$size.png"), [System.Drawing.Imaging.ImageFormat]::Png)
    $format.Dispose(); $font.Dispose(); $red.Dispose(); $gold.Dispose(); $graphics.Dispose(); $bitmap.Dispose()
}
