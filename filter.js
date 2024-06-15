#!/usr/bin/env node
"use strict";

import pandoc from 'pandoc-filter';
import AsciiMathParser from 'asciimath2tex';

const parser = new AsciiMathParser()

function action({ t: type, c: value }, _format, _meta) {
    if (type==='Math' && value.length==2) {
        if (value[1][0] == '@') {
            return pandoc.Formula(
                value[0],
                value[1].substring(1),
            )
        }
        let p = parser.parse(value[1]).replaceAll('02938740', '\\sim').replaceAll('~', '\\\\');
        if (value[1].includes('&') && p.includes('\\\\')) {
            p = '\\begin{aligned}' + p + '\\end{aligned}'
        } else if (p.includes('\\\\')) {
            p = '\\begin{gathered}' + p + '\\end{gathered}'
        }
        return pandoc.Formula(
            value[0],
            p
        )
    }
}

pandoc.stdio(action);
