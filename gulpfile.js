var gulp      = require( 'gulp' ),
    rename    = require( 'gulp-rename' ),     // Renommage des fichiers
    sass      = require( 'gulp-sass' ),       // Conversion des SCSS en CSS
    minifyCss = require( 'gulp-minify-css' ), // Minification des CSS
    uglify    = require( 'gulp-uglify' ),     // Minification/Obfuscation des JS
    jshint = require('gulp-jshint'),
    concat = require('gulp-concat'),
    resolveDependencies = require('gulp-resolve-dependencies'),
    plumber   = require( 'gulp-plumber' );    // Ne pas arrêter gulp en cas d'erreur

gulp.task('js-linting-compiling', function(){
  return gulp.src('./src/js/*.js') // read all of the files that are in script/lib with a .js extension
    .pipe(resolveDependencies({
      pattern: /\* @requires [\s-]*(.*\.js)/g
    }))
        .on('error', function(err) {
            console.log(err.message);
        })
    .pipe(jshint()) // run their contents through jshint
    .pipe(jshint.reporter('default')) // report any findings from jshint
    .pipe(concat('StateAutomaton.js')) // concatenate all of the file contents into a file titled 'all.js'
    .pipe(gulp.dest('./dist/js')) // write that file to the dist/js directory
    .pipe(rename('StateAutomaton.min.js')) // now rename the file in memory to 'all.min.js'
    .pipe(uglify({  // run uglify (for minification) on 'all.min.js'
        output: {
            comments: /^!|\b(copyright|license)\b|@(preserve|license|cc_on)\b/i
        }
    }))
    .pipe(gulp.dest('./dist/js')); // write all.min.js to the dist/js file
});

// SCSS TASK
gulp.task( 'css', function() {
  return gulp.src( './src/style/sass/*.scss' )    // Prend en entrée les fichiers *.scss
    .pipe( sass() )                               // Compile les fichiers
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
  //gulp.watch( './src/js/*.src.js', [ 'js-uglify' ] );
  gulp.watch( './src/js/*.src.js', [ 'js-linting-compiling' ] );
});

gulp.task( 'default', [ 'watch' ] );