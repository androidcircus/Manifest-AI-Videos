# Replace checkout@v4 with checkout@v6
find .github/workflows -name "*.yml" -exec sed -i 's/actions\/checkout@v4/actions\/checkout@v6/g' {} \;

# Replace setup-python@v3 with setup-python@v6
find .github/workflows -name "*.yml" -exec sed -i 's/actions\/setup-python@v3/actions\/setup-python@v6/g' {} \;

# Replace setup-python@v5 with setup-python@v6 (if used)
find .github/workflows -name "*.yml" -exec sed -i 's/actions\/setup-python@v5/actions\/setup-python@v6/g' {} \;