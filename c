if [ ! -d "dist" ]
then
  # dist folder does not exist, create.
  mkdir dist
  echo Created dist directory
fi

tsc --version
echo Starting TypeScript compile
tsc --rootDir src/ --outDir dist/
