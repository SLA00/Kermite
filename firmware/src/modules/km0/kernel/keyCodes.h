#pragma once

enum LogicalKey {
  LK_NONE = 0,
  LK_A = 1,
  LK_B,
  LK_C,
  LK_D,
  LK_E,
  LK_F,
  LK_G,
  LK_H,
  LK_I,
  LK_J,
  LK_K,
  LK_L,
  LK_M,
  LK_N,
  LK_O,
  LK_P,
  LK_Q,
  LK_R,
  LK_S,
  LK_T,
  LK_U,
  LK_V,
  LK_W,
  LK_X,
  LK_Y,
  LK_Z,
  LK_Num_0,
  LK_Num_1,
  LK_Num_2,
  LK_Num_3,
  LK_Num_4,
  LK_Num_5,
  LK_Num_6,
  LK_Num_7,
  LK_Num_8,
  LK_Num_9,
  LK_Escape,
  LK_Space,
  LK_Enter,
  LK_Tab,
  LK_BackSpace,
  LK_F1,
  LK_F2,
  LK_F3,
  LK_F4,
  LK_F5,
  LK_F6,
  LK_F7,
  LK_F8,
  LK_F9,
  LK_F10,
  LK_F11,
  LK_F12,
  LK_Dot,
  LK_Comma,
  LK_Exclamation,
  LK_Question,
  LK_Colon,
  LK_Semicolon,
  LK_Underscore,
  LK_Plus,
  LK_Minus,
  LK_Asterisk,
  LK_Slash,
  LK_Equal,
  LK_Ampersand,
  LK_VerticalBar,
  LK_Hat,
  LK_Tilde,
  LK_AtMark,
  LK_Sharp,
  LK_Dollar,
  LK_Yen,
  LK_Percent,
  LK_BackSlash,
  LK_SingleQuote,
  LK_DoubleQuote,
  LK_BackQuote,
  LK_LeftParenthesis,
  LK_RightParenthesis,
  LK_LeftSquareBracket,
  LK_RightSquareBracket,
  LK_LeftCurlyBrace,
  LK_RightCurlyBrace,
  LK_LessThan,
  LK_GreaterThan,
  LK_Ctrl,
  LK_Shift,
  LK_Alt,
  LK_Gui,
  LK_Home,
  LK_End,
  LK_Insert,
  LK_Delete,
  LK_PageUp,
  LK_PageDn,
  LK_LeftArrow,
  LK_RightArrow,
  LK_UpArrow,
  LK_DownArrow,
  LK_PrintScreen,
  LK_CapsLock,
  LK_ScrollLock,
  LK_PauseBreak,
  LK_Menu,
  LK_HankakuZenkaku,
  LK_KatakanaHiragana,
  LK_Muhenkan,
  LK_Henkan,
  LK_Special_0,
  LK_Special_1,
  LK_Special_2,
  LK_Special_3,
  LK_Special_4,
  LK_Special_5,
  LK_Special_6,
  LK_Special_7,
  LK_Special_8,
  LK_Special_9,
  LK_Special_10,
  LK_Special_11,
  LK_Special_12,
  LK_Special_13,
  LK_Special_14,
  LK_Special_15,
  LK_F13,
  LK_F14,
  LK_F15,
  LK_F16,
  LK_F17,
  LK_F18,
  LK_F19,
  LK_F20,
  LK_F21,
  LK_F22,
  LK_F23,
  LK_F24,
  LK_NumPad_0,
  LK_NumPad_1,
  LK_NumPad_2,
  LK_NumPad_3,
  LK_NumPad_4,
  LK_NumPad_5,
  LK_NumPad_6,
  LK_NumPad_7,
  LK_NumPad_8,
  LK_NumPad_9,
  LK_NumPad_Dot,
  LK_NumPad_Plus,
  LK_NumPad_Minus,
  LK_NumPad_Asterisk,
  LK_NumPad_Slash,
  LK_NumPad_Equal,
  LK_NumPad_Enter,
  LK_NumPad_BackSpace,
  LK_NumPad_00,
  LK_NumLock,
  LK_LCtrl,
  LK_LShift,
  LK_LAlt,
  LK_LGui,
  LK_RCtrl,
  LK_RShift,
  LK_RAlt,
  LK_RGui,
  LK_NN,
  LK_LTU,
  LK_UU,
  LK_NextDouble,
  LK_PostDouble,
  LK_U0,
  LK_U1,
  LK_U2,
  LK_U3,
  LK_U4,
  LK_U5,
  LK_U6,
  LK_U7,
  LK_U8,
  LK_U9,
  LK_RoutingSource_Any,
  LK_RoutingDestination_Keep,
  LK_Lang1Kana,
  LK_Lang2Eisu
};
