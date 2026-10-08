function f1 ()
{
  //Sys.Process("python").Window("TkTopLevel", "Mini Excel - TestComplete Practice", 1).Window("TkChild", "", 1).wText="Hello";
  //Sys.Process("Notepad").Window("Notepad", "Untitled - Notepad", 1).Window("NotepadTextBox", "", 1).Window("RichEditD2DPT", "", 1).wText="Hello";
  Sys.Process("python").Window("TkTopLevel", "Mini Excel - TestComplete Practice", 1).Window("TkChild", "", 1).Window("TkChild", "", 4).Window("TkChild", "", 3).wText="John"
}