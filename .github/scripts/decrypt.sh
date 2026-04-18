#!/bin/sh

gpg --quiet --batch --yes --decrypt --passphrase="$KEYS_KEYSTORE_PASSPHRASE" \
--output .env .env.gpg
