# Version locks

This file describes reasons for why some dependencies have an exact version instead of a caret one.

- `eslint-plugin-import@2.22.1` because higher versions throw ordering errors for imports on Windows.
