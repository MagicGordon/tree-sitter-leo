const PREC = {
  token: 1,
  unknown: -1,
};

module.exports = grammar({
  name: "leo",

  extras: $ => [
    /[\s\uFEFF\u2060\u200B]+/,
    $.comment,
  ],

  word: $ => $.identifier,

  rules: {
    source_file: $ => repeat($._item),

    _item: $ => choice(
      $.program_declaration,
      $.import_declaration,
      $.const_declaration,
      $.interface_declaration,
      $.struct_declaration,
      $.record_declaration,
      $.mapping_declaration,
      $.storage_declaration,
      $.constructor_declaration,
      $.test_function_declaration,
      $.view_function_declaration,
      $.final_function_declaration,
      $.function_declaration,
      $.transition_declaration,
      $.inline_declaration,
      $.finalizer_declaration,
      $.script_declaration,
      $.fn_declaration,
      $.block,
      $.parenthesized_expression,
      $.bracketed_expression,
      $.annotation_item,
      $._token,
    ),

    program_declaration: $ => prec(1, seq(
      $.program_keyword,
      field("name", $.program_id),
      field("body", $.block),
    )),

    import_declaration: $ => prec(1, seq(
      $.import_keyword,
      field("path", choice($.locator, $.program_id, $.identifier)),
      ";",
    )),

    const_declaration: $ => prec(1, seq(
      repeat($.annotation),
      $.const_keyword,
      field("name", $.identifier),
      $.declaration_tail,
      ";",
    )),

    interface_declaration: $ => prec(1, seq(
      repeat($.annotation),
      $.interface_keyword,
      field("name", $.identifier),
      optional(seq(":", $.declaration_tail)),
      field("body", $.block),
    )),

    struct_declaration: $ => prec(1, seq(
      repeat($.annotation),
      $.struct_keyword,
      field("name", $.identifier),
      field("body", $.block),
    )),

    record_declaration: $ => prec(1, seq(
      repeat($.annotation),
      $.record_keyword,
      field("name", $.identifier),
      choice(field("body", $.block), ";"),
    )),

    mapping_declaration: $ => prec(1, seq(
      repeat($.annotation),
      $.mapping_keyword,
      field("name", $.identifier),
      $.declaration_tail,
      ";",
    )),

    storage_declaration: $ => prec(1, seq(
      repeat($.annotation),
      $.storage_keyword,
      field("name", $.identifier),
      $.declaration_tail,
      ";",
    )),

    constructor_declaration: $ => prec(1, seq(
      repeat($.annotation),
      $.constructor_keyword,
      field("parameters", $.parameter_list),
      field("body", $.block),
    )),

    test_function_declaration: $ => prec(2, seq(
      $.test_annotation,
      repeat($.annotation),
      choice($.function_keyword, $.fn_keyword),
      field("name", $.identifier),
      $._callable_tail,
    )),

    function_declaration: $ => prec(1, seq(
      repeat($.annotation),
      $.function_keyword,
      field("name", $.identifier),
      $._callable_tail,
    )),

    view_function_declaration: $ => prec(1, seq(
      repeat($.annotation),
      $.view_keyword,
      $.fn_keyword,
      field("name", $.identifier),
      $._callable_tail,
    )),

    final_function_declaration: $ => prec(1, seq(
      repeat($.annotation),
      $.final_keyword,
      $.fn_keyword,
      field("name", $.identifier),
      $._callable_tail,
    )),

    transition_declaration: $ => prec(1, seq(
      repeat($.annotation),
      optional($.async_keyword),
      $.transition_keyword,
      field("name", $.identifier),
      $._callable_tail,
    )),

    inline_declaration: $ => prec(1, seq(
      repeat($.annotation),
      $.inline_keyword,
      field("name", $.identifier),
      $._callable_tail,
    )),

    finalizer_declaration: $ => prec(1, seq(
      repeat($.annotation),
      $.final_keyword,
      field("name", $.identifier),
      $._callable_tail,
    )),

    script_declaration: $ => prec(1, seq(
      repeat($.annotation),
      $.script_keyword,
      field("name", $.identifier),
      $._callable_tail,
    )),

    fn_declaration: $ => prec(1, seq(
      repeat($.annotation),
      $.fn_keyword,
      field("name", $.identifier),
      $._callable_tail,
    )),

    _callable_tail: $ => seq(
      optional($.type_parameters),
      optional($.const_parameters),
      field("parameters", $.parameter_list),
      optional($.return_type),
      choice(field("body", $.block), ";"),
    ),

    annotation_item: $ => prec(-1, choice(
      $.test_annotation,
      $.annotation,
    )),

    return_type: $ => seq(
      $.arrow_operator,
      repeat1(choice(
        $.type_parameters,
        $.parenthesized_expression,
        $.bracketed_expression,
        $._non_closing_token,
      )),
    ),

    declaration_tail: $ => repeat1(choice(
      $.type_parameters,
      $.parenthesized_expression,
      $.bracketed_expression,
      $._non_closing_token,
    )),

    type_parameters: $ => seq(
      "<",
      repeat(choice(
        $.parameter_list,
        $.bracketed_expression,
        $.const_keyword,
        $.identifier,
        $.builtin_type,
        $.visibility,
        $.numeric_literal,
        ":",
        ",",
      )),
      ">",
    ),

    const_parameters: $ => seq(
      "::",
      $.bracketed_expression,
    ),

    parameter_list: $ => seq(
      "(",
      repeat(choice(
        $.parameter_list,
        $.bracketed_expression,
        $._non_closing_token,
      )),
      ")",
    ),

    parenthesized_expression: $ => seq(
      "(",
      repeat(choice(
        $.parenthesized_expression,
        $.bracketed_expression,
        $.block,
        $._token,
      )),
      ")",
    ),

    bracketed_expression: $ => seq(
      "[",
      repeat(choice(
        $.parenthesized_expression,
        $.bracketed_expression,
        $.block,
        $._token,
      )),
      "]",
    ),

    block: $ => seq(
      "{",
      repeat($._item),
      "}",
    ),

    _non_closing_token: $ => choice(
      $.program_keyword,
      $.import_keyword,
      $.const_keyword,
      $.interface_keyword,
      $.struct_keyword,
      $.record_keyword,
      $.mapping_keyword,
      $.storage_keyword,
      $.constructor_keyword,
      $.function_keyword,
      $.transition_keyword,
      $.inline_keyword,
      $.final_keyword,
      $.script_keyword,
      $.fn_keyword,
      $.async_keyword,
      $.arrow_operator,
      $.keyword,
      $.visibility,
      $.builtin_type,
      $.boolean,
      $.none,
      $.special_expression,
      $.special_path,
      $.numeric_literal,
      $.address_literal,
      $.identifier_literal,
      $.locator,
      $.program_id,
      $.underscore,
      $.identifier,
      $.string,
      $.operator,
      ":",
      ",",
      ".",
      "::",
    ),

    _token: $ => choice(
      $._non_closing_token,
      ";",
    ),

    comment: _ => token(prec(2, choice(
      seq("//", /[^\n]*/),
      seq("/*", /[^*]*\*+([^/*][^*]*\*+)*/, "/"),
    ))),

    test_annotation: _ => token(prec(2, /@test(\([^)]*\))?/)),

    annotation: _ => token(prec(PREC.token, /@[A-Za-z_][A-Za-z0-9_]*(\([^)]*\))?/)),

    program_keyword: _ => token(prec(PREC.token, "program")),
    import_keyword: _ => token(prec(PREC.token, "import")),
    const_keyword: _ => token(prec(PREC.token, "const")),
    interface_keyword: _ => token(prec(PREC.token, "interface")),
    struct_keyword: _ => token(prec(PREC.token, "struct")),
    record_keyword: _ => token(prec(PREC.token, "record")),
    mapping_keyword: _ => token(prec(PREC.token, "mapping")),
    storage_keyword: _ => token(prec(PREC.token, "storage")),
    constructor_keyword: _ => token(prec(PREC.token, "constructor")),
    function_keyword: _ => token(prec(PREC.token, "function")),
    transition_keyword: _ => token(prec(PREC.token, "transition")),
    inline_keyword: _ => token(prec(PREC.token, "inline")),
    final_keyword: _ => token(prec(PREC.token, "final")),
    view_keyword: _ => token(prec(PREC.token, "view")),
    script_keyword: _ => token(prec(PREC.token, "script")),
    fn_keyword: _ => token(prec(PREC.token, "fn")),
    async_keyword: _ => token(prec(PREC.token, "async")),
    arrow_operator: _ => token(prec(PREC.token, "->")),

    keyword: _ => token(prec(PREC.token, choice(
      "aleo",
      "as",
      "assert",
      "assert_eq",
      "assert_neq",
      "else",
      "for",
      "if",
      "in",
      "let",
      "return",
    ))),

    visibility: _ => token(prec(PREC.token, choice(
      "constant",
      "private",
      "public",
    ))),

    builtin_type: _ => token(prec(PREC.token, choice(
      "address",
      "bool",
      "boolean",
      "field",
      "Fn",
      "Final",
      "Future",
      "group",
      "dyn",
      "i8",
      "i16",
      "i32",
      "i64",
      "i128",
      "identifier",
      "scalar",
      "signature",
      "string",
      "u8",
      "u16",
      "u32",
      "u64",
      "u128",
    ))),

    boolean: _ => token(prec(PREC.token, choice("true", "false"))),

    none: _ => token(prec(PREC.token, "none")),

    special_expression: _ => token(prec(PREC.token, choice(
      "self.address",
      "self.caller",
      "self.signer",
      "block.height",
      "network.id",
      "self",
      "block",
      "network",
    ))),

    special_path: _ => token(prec(PREC.token, choice(
      /group::[A-Za-z_][A-Za-z0-9_]*/,
      /signature::[A-Za-z_][A-Za-z0-9_]*/,
      /Future::[A-Za-z_][A-Za-z0-9_]*/,
    ))),

    numeric_literal: _ => token(prec(PREC.token, choice(
      /0b[01][01_]*(u8|u16|u32|u64|u128|i8|i16|i32|i64|i128)?/,
      /0o[0-7][0-7_]*(u8|u16|u32|u64|u128|i8|i16|i32|i64|i128)?/,
      /0x[0-9A-Fa-f][0-9A-Fa-f_]*(u8|u16|u32|u64|u128|i8|i16|i32|i64|i128)?/,
      /[0-9][0-9_]*(u8|u16|u32|u64|u128|i8|i16|i32|i64|i128|field|group|scalar)?/,
    ))),

    address_literal: _ => token(prec(PREC.token, /aleo1[a-z0-9]+/)),

    identifier_literal: _ => token(prec(PREC.token, /'[A-Za-z][A-Za-z0-9_]*'/)),

    locator: _ => token(prec(PREC.token, /[A-Za-z_][A-Za-z0-9_]*\.aleo\/[A-Za-z_][A-Za-z0-9_]*/)),

    program_id: _ => token(prec(PREC.token, /[A-Za-z_][A-Za-z0-9_]*\.aleo/)),

    underscore: _ => token(prec(PREC.token, "_")),

    identifier: _ => token(prec(PREC.token, /[A-Za-z_][A-Za-z0-9_]*/)),

    string: _ => token(seq(
      "\"",
      repeat(choice(
        /[^"\\\n]/,
        /\\./,
      )),
      "\"",
    )),

    operator: _ => token(prec(PREC.token, choice(
      "=>",
      "..=",
      "..",
      "==",
      "!=",
      "<=",
      ">=",
      "&&",
      "||",
      "<<=",
      ">>=",
      "<<",
      ">>",
      "**=",
      "**",
      "+=",
      "-=",
      "*=",
      "/=",
      "%=",
      "&=",
      "|=",
      "^=",
      "&&=",
      "||=",
      "=",
      "<",
      ">",
      "!",
      "&",
      "|",
      "^",
      "+",
      "-",
      "*",
      "/",
      "%",
      "?",
    ))),

    unknown: _ => token(prec(PREC.unknown, /./)),
  },
});
