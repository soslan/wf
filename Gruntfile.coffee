module.exports = (grunt) ->
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
				separator: ';'
			dist:
				src: ['src/core.js', 'src/value.js', 'src/value-supplemental.js', 'src/wf.js', 'src/container.js',
					'src/containers.js', 'src/views.js', 'src/svg.js', 'src/chart.js'
					]
				dest: 'build/<%= pkg.name %>.js'
		sass:
			dist:
				options:
					style: 'expanded'
				files:
					'build/<%= pkg.name %>.css': 'src/css/<%= pkg.name %>.scss'

		)

	grunt.loadNpmTasks('grunt-contrib-uglify')
	grunt.loadNpmTasks('grunt-contrib-concat')
	grunt.loadNpmTasks('grunt-contrib-sass')

	grunt.registerTask('default', ['concat', 'uglify', 'sass'])