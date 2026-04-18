#!/bin/sh

gpg --quiet --batch --yes --symmetric --passphrase="$KEYS_KEYSTORE_PASSPHRASE" \
--output .env.gpg .env
