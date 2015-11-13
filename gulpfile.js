var gulp      = require( 'gulp' ),
    rename    = require( 'gulp-rename' ),     // Renommage des fichiers
    sass      = require( 'gulp-sass' ),       // Conversion des SCSS en CSS
    minifyCss = require( 'gulp-minify-css' ), // Minification des CSS
    uglify    = require( 'gulp-uglify' ),     // Minification/Obfuscation des JS
    plumber   = require( 'gulp-plumber' );    // Ne pas arrêter gulp en cas d'erreur

// SCSS TASK
gulp.task( 'css', function() {
  return gulp.src( './src/style/sass/*.scss' )    // Prend en entrée les fichiers *.scss
    .pipe( sass() )                     		  // Compile les fichiers
    .pipe( minifyCss() )                          // Minifie le CSS qui a été généré
    .pipe( gulp.dest( './dist/style/' ) );           // Sauvegarde le tout dans /src/style
});

// JAVASCRIPT TASK
gulp.task( 'js-uglify', function() {
  return gulp.src( './src/js/*.src.js' )    // Prend en entrée les fichiers *.src.js
    .pipe( rename( function( path ){
      	// Il y a différentes méthodes pour renommer les fichiers
      	// Voir ici pour plus d'infos : https://www.npmjs.org/package/gulp-rename
    	path.basename = path.basename.replace( ".src" , ".min" );
    }))
    .pipe( uglify() )
    .pipe( gulp.dest( './dist/js/' ) );
});


// WATCH TASK
gulp.task( 'watch', function() {
  gulp.watch( './src/style/sass/*.scss', [ 'css' ] );
  gulp.watch( './src/js/*.src.js', [ 'js-uglify' ] );
});

gulp.task( 'default', [ 'watch' ] );