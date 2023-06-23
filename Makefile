build:
	npm run build
deploy: TAG:=$(shell git describe --tags --exact-match 2>/dev/null)
deploy: BRANCH:=$(shell git symbolic-ref -q --short HEAD 2>/dev/null)
deploy: build
	if [ "${TAG}" != "" ]; then \
		aws s3 cp --acl public-read --recursive docs/dist/ 's3://${CDN_S3_BUCKET}/libs/mt-block-editor-block-oembed/${TAG}/'; \
	elif [ "${BRANCH}" = "develop" ]; then \
		aws s3 cp --acl public-read --recursive docs/dist/ 's3://${CDN_S3_BUCKET}/libs/mt-block-editor-block-oembed/${BRANCH}/'; \
	elif [ "${BRANCH}" != "" ]; then \
		aws s3 cp --acl public-read --recursive docs/dist/ 's3://${CDN_S3_BUCKET}/libs/mt-block-editor-block-oembed/branch/${BRANCH}/'; \
	else \
		echo "Can not find tag or branch to deploy"; \
		exit 1; \
	fi
