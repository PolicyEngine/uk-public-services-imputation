.PHONY: docs

docs:
	jb clean docs && jb build docs

install:
	pip install -e .
