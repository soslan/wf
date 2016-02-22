#! /bin/env ruby
require 'redcarpet'
require 'fileutils'

def rednder_one(renderer, filename, template)
	stem = File.basename(filename, ".*")
	rendered = renderer.render(File.read(filename))
	output = template.sub('{{{content}}}', rendered)
	File.write("dist/wf-docs/#{stem}.html", output)
	puts "#{stem}.html"
end

renderer = Redcarpet::Render::HTML.new(render_options = {
	with_toc_data: true
	})
markdown = Redcarpet::Markdown.new(renderer)
template = File.read('docs/templates/template.html')

if not Dir.exist?('dist/wf-docs')
	begin
		Dir.mkdir('dist')
		Dir.mkdir('dist/wf-docs')
	rescue SystemCallError
		puts 'Error: Can not create "dist/wf-docs".'
		exit
	end
end

Dir.glob('docs/*.md'){|filename|
	rednder_one(markdown, filename, template)
}

FileUtils.copy_entry('docs/static', 'dist/wf-docs/static')


