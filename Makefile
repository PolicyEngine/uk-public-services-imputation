.PHONY: docs data

docs:
	jupyter-book clean docs && jupyter-book build docs
	python docs/add_plotly_to_book.py docs

install:
	pip install -e .

data:
	uk-public-services-imputation

test:
	pytest tests

format:
	black . -l 79
