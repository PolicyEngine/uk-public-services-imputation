.PHONY: docs

docs:
	jb clean docs && jb build docs

install:
	pip install -e .

data:
	./uk-public-services-imputation

test:
	echo "No tests yet"