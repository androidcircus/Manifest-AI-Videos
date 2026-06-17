#!/bin/bash
# Fix all GitHub workflow files

echo "📁 Fixing workflow files..."

# Update static.yml specifically
if [ -f ".github/workflows/static.yml" ]; then
    echo "Fixing static.yml..."
    sed -i 's/actions\/checkout@v4/actions\/checkout@v6/g' .github/workflows/static.yml
    sed -i 's/actions\/configure-pages@v5/actions\/configure-pages@v6/g' .github/workflows/static.yml
    sed -i 's/actions\/upload-pages-artifact@v3/actions\/upload-pages-artifact@v4/g' .github/workflows/static.yml
fi

# Fix all workflow files
for file in .github/workflows/*.yml; do
    echo "Fixing $file..."
    sed -i 's/actions\/checkout@v4/actions\/checkout@v6/g' "$file"
    sed -i 's/actions\/setup-python@v3/actions\/setup-python@v6/g' "$file"
    sed -i 's/actions\/setup-python@v5/actions\/setup-python@v6/g' "$file"
    sed -i 's/actions\/configure-pages@v5/actions\/configure-pages@v6/g' "$file"
    sed -i 's/actions\/upload-pages-artifact@v3/actions\/upload-pages-artifact@v4/g' "$file"
done

echo "✅ Done! Commit and push the changes."