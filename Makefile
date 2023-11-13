.PHONY: setup start

clean:
	rm -Rf _site .jekyll-cache

setup:
	bundle install

start: clean
	bundle exec jekyll serve
