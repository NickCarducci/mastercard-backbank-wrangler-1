//#include <emscripten/val.h>
#include <emscripten.h>
#include <stdio.h>
//#include <stdlib.h>

EM_ASYNC_JS(int, openXML, (), {
  //out("waiting for a fetch");
  //std::system("backbank.php");
   // -
  //emscripten::val("backbank.php");
  /*const response = await fetch("a.html");
  out("got the fetch response"); //normally you would do something with the fetch here
  */
  return fopen("./backbank.php", "r");//42
});
int main () {
  //puts("before");
  openXML();
  //puts("after");
  return 0;
}
