module.exports = (grunt) ->
	require('load-grunt-tasks')(grunt)
	grunt.initConfig(
		pkg: grunt.file.readJSON('package.json')
		uglify: 
			options:
				banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
			build: 
				src: 'build/<%= pkg.name %>.js'
				dest: 'build/<%= pkg.name %>.min.js'
		concat:
			options:
				separator: grunt.util.linefeed + ';' + grunt.util.linefeed
			dist:
				# expand: true
				src: ['src/js/core.js', 'src/js/value.js', 'src/js/value-supplemental.js', 'src/js/container.js', 'src/js/wf.js',
					'src/js/containers.js', 'src/js/views.js', 'src/js/svg.js', 'src/js/chart.js'
					]
				# src: 'src/es6/*.js'
				dest: 'build/<%= pkg.name %>.js'
		sass:
			dist:
				options:
					style: 'expanded'
				files:
					'build/<%= pkg.name %>.css': 'src/css/<%= pkg.name %>.scss'
		autoprefixer:
			options:
				map: true
			dist:
				src: 'build/<%= pkg.name %>.css'
				dest: 'build/<%= pkg.name %>.css'
		babel:
			options:
				sourceMap: false
				compact: false
			dist:
				# files: [
				# 	expand: true
				# 	cwd: 'src/es6/'
				# 	dest: 'build/src/es5/'
				# 	src: '*.js'
				# ]
				src: 'build/wf.es6.js'
				dest: 'build/wf.js'
					
		)

	grunt.loadNpmTasks('grunt-contrib-uglify')
	grunt.loadNpmTasks('grunt-contrib-concat')
	grunt.loadNpmTasks('grunt-contrib-sass')
	grunt.loadNpmTasks('grunt-autoprefixer')

	grunt.registerTask('default', ['concat', 'uglify', 'sass', 'autoprefixer'])