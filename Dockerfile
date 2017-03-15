FROM bitnami/apache
MAINTAINER Olemis Lang <olemis@cuban.tech>

# Add the whole repo.
ADD . /opt/bitnami/apache/htdocs/

# Set this as initial path when ssh logging.
WORKDIR /opt/bitnami/apache/htdocs/
