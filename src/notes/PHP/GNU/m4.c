//https://git.savannah.gnu.org/cgit/m4.git/tree/src/m4.c?h=branch-1.4

#include "m4.h"

#include <getopt.h>
#include <limits.h>
#include <signal.h>

#include "c-stack.h"
#include "configmake.h"
#include "ignore-value.h"
#include "progname.h"
#include "propername.h"
#include "version-etc.h"

#ifdef DEBUG_STKOVF
# include "assert.h"
#endif

/* TRANSLATORS: This is a non-ASCII name: The first name is (with
   Unicode escapes) "Ren\u00e9" or (with HTML entities) "Ren&eacute;".  */
#define AUTHORS proper_name_utf8 ("Rene' Seindal", "Ren\xC3\xA9 Seindal")

static _Noreturn void usage (int);

int sync_output = 0;// /lib/cpp (-s).
int debug_level = 0;// Debug (-d[flags])
size_t hash_table_size = HASHMAX;//(prime) Hash table size (-Hsize)
int no_gnu_extensions = 0;// Disable GNU extensions (-G).
int prefix_all_builtins = 0;// Prefix `m4_' on builtin functions/methods.
int max_debug_argument_length = 0;// Max length of arguments in trace output (-lsize).
int suppress_warnings = 0;// Suppress warnings about missing arguments.

static bool fatal_warnings = false;// warnings affect fatal 'exit'.

int warning_status = 0;// exit status if non-zero.
int nesting_limit = 1024;// expansion_level macro.c limit

#ifdef ENABLE_CHANGEWORD
const char *user_word_regexp = "";// Optional regexp input for describing m4 words.
#endif

int retcode;// (watcher) Global catchall of final error status (running).
//https://github.com/php/php-src/blob/master/Zend/Makefile.frag
//https://www.gnu.org/software/m4/
//https://savannah.gnu.org/projects/m4/
struct whatever
{
  struct whatever *next;
  int code;
  const char *arg;
};
//pointer first struct definition declaration 
typedef struct whatever whatever;
/*
http://www.cs.toronto.edu/~heap/270F02/node31.html
'struct' declares a pointer to itself as member before creation.
'public' declares a callable member.
'member' is method of a class.
-----
struct macro_definition
{
  struct macro_definition *next;
  int code; //D, U, s, t, '\1', or DEBUGFILE_OPTION. 
  const char *arg;
};
typedef struct macro_definition macro_definition;
*/




void //Error
m4_error (int status, int errnum, const char *format, ...)
{
  va_list args;
  va_start (args, format);
  verror_at_line (status, errnum, current_line ? current_file : NULL,
                  current_line, format, args);
  if (fatal_warnings && ! retcode)
    retcode = EXIT_FAILURE;
  va_end (args);
}

void //failure
m4_failure (int errnum, const char *format, ...)
{
  va_list args;
  va_start (args, format);
  verror_at_line (EXIT_FAILURE, errnum, current_line ? current_file : NULL,
                  current_line, format, args);
  assume (false);
}

void //error at line
m4_error_at_line (int status, int errnum, const char *file, int line,
                  const char *format, ...)
{
  va_list args;
  va_start (args, format);
  verror_at_line (status, errnum, line ? file : NULL, line, format, args);
  if (fatal_warnings && ! retcode)
    retcode = EXIT_FAILURE;
  va_end (args);
}

void //failure at line
m4_failure_at_line (int errnum, const char *file, int line,
                    const char *format, ...)
{
  va_list args;
  va_start (args, format);
  verror_at_line (EXIT_FAILURE, errnum, line ? file : NULL,
                  line, format, args);
  assume (false);
}

#ifndef SIGBUS
# define SIGBUS SIGILL
#endif

#ifndef NSIG
# ifndef MAX
#  define MAX(a,b) ((a) < (b) ? (b) : (a))
# endif
# define NSIG (MAX (SIGABRT, MAX (SIGILL, MAX (SIGFPE,  \
                                               MAX (SIGSEGV, SIGBUS)))) + 1)
#endif

/* Pre-translated messages for program errors.  Do not translate in
   the signal handler, since gettext and strsignal are not
   async-signal-safe.  */
static const char * volatile program_error_message;
static const char * volatile signal_message[NSIG];

/* Print a nicer message about any programmer errors, then exit.  This
   must be aysnc-signal safe, since it is executed as a signal
   handler.  If SIGNO is zero, this represents a stack overflow; in
   that case, we return to allow c_stack_action to handle things.  */
static void
fault_handler (int signo)
{
  if (signo)
    {
      /* POSIX states that reading static memory is, in general, not
         async-safe.  However, the static variables that we read are
         never modified once this handler is installed, so this
         particular usage is safe.  And it seems an oversight that
         POSIX claims strlen is not async-safe.  Ignore write
         failures, since we will exit with non-zero status anyway.  */
#define WRITE(f, b, l) ignore_value (write (f, b, l))
      WRITE (STDERR_FILENO, program_name, strlen (program_name));
      WRITE (STDERR_FILENO, ": ", 2);
      WRITE (STDERR_FILENO, program_error_message,
             strlen (program_error_message));
      if (signal_message[signo])
        {
          WRITE (STDERR_FILENO, ": ", 2);
          WRITE (STDERR_FILENO, signal_message[signo],
                 strlen (signal_message[signo]));
        }
      WRITE (STDERR_FILENO, "\n", 1);
#undef WRITE
      _exit (EXIT_INTERNAL_ERROR);
    }
}


static void //usage and status print message
usage (int status)
{
  if (status != EXIT_SUCCESS)
    {
      xfprintf (stderr, _("Try `%s --help' for more information."),
                program_name);
      fputs ("\n", stderr);
    }
  else
    {
      xprintf (_("Usage: %s [OPTION]... [FILE]...\n"), program_name);
      fputs (_("\
Process macros in FILEs.  If no FILE or if FILE is `-', standard input\n\
is read.\n\
"), stdout);
      puts ("");
      fputs (_("\
Mandatory or optional arguments to long options are mandatory or optional\n\
for short options too.\n\
"), stdout);
      puts ("");
      fputs (_("\
Operation modes:\n\
      --help                   display this help and exit\n\
      --version                output version information and exit\n\
"), stdout);
      fputs (_("\
  -E, --fatal-warnings         once: warnings become errors, twice: stop\n\
                                 execution at first error\n\
  -i, --interactive            unbuffer output, ignore interrupts\n\
  -P, --prefix-builtins        force a `m4_' prefix to all builtins\n\
  -Q, --quiet, --silent        suppress some warnings for builtins\n\
"), stdout);
      xprintf (_("\
      --warn-macro-sequence[=REGEXP]\n\
                               warn if macro definition matches REGEXP,\n\
                                 default %s\n\
"), DEFAULT_MACRO_SEQUENCE);
#ifdef ENABLE_CHANGEWORD
      fputs (_("\
  -W, --word-regexp=REGEXP     use REGEXP for macro name syntax\n\
"), stdout);
#endif
      puts ("");
      fputs (_("\
Preprocessor features:\n\
  -D, --define=NAME[=VALUE]    define NAME as having VALUE, or empty\n\
  -I, --include=DIRECTORY      append DIRECTORY to include path\n\
  -s, --synclines              generate `#line NUM \"FILE\"' lines\n\
  -U, --undefine=NAME          undefine NAME\n\
"), stdout);
      puts ("");
      xprintf (_("\
Limits control:\n\
  -g, --gnu                    override -G to re-enable GNU extensions\n\
  -G, --traditional            suppress all GNU extensions\n\
  -H, --hashsize=PRIME         set symbol lookup hash table size [509]\n\
  -L, --nesting-limit=NUMBER   change nesting limit, 0 for unlimited [%d]\n\
"), nesting_limit);
      puts ("");
      fputs (_("\
Frozen state files:\n\
  -F, --freeze-state=FILE      produce a frozen state on FILE at end\n\
  -R, --reload-state=FILE      reload a frozen state from FILE at start\n\
"), stdout);
      puts ("");
      fputs (_("\
Debugging:\n\
  -d, --debug[=FLAGS]          set debug level (no FLAGS implies `aeq')\n\
      --debugfile[=FILE]       redirect debug and trace output to FILE\n\
                                 (default stderr, discard if empty string)\n\
  -l, --arglength=NUM          restrict macro tracing size\n\
  -t, --trace=NAME             trace NAME when it is defined\n\
"), stdout);
      puts ("");
      fputs (_("\
FLAGS is any of:\n\
  a   show actual arguments\n\
  c   show before collect, after collect and after call\n\
  e   show expansion\n\
  f   say current input file name\n\
  i   show changes in input files\n\
"), stdout);
      fputs (_("\
  l   say current input line number\n\
  p   show results of path searches\n\
  q   quote values as necessary, with a or e flag\n\
  t   trace for all macro calls, not only traceon'ed\n\
  x   add a unique macro call id, useful with c flag\n\
  V   shorthand for all of the above flags\n\
"), stdout);
      puts ("");
      fputs (_("\
If defined, the environment variable `M4PATH' is a colon-separated list\n\
of directories included after any specified by `-I'.\n\
"), stdout);
      puts ("");
      fputs (_("\
Exit status is 0 for success, 1 for failure, 63 for frozen file version\n\
mismatch, or whatever value was passed to the m4exit macro.\n\
"), stdout);
      emit_bug_reporting_address ();
    }
  exit (status);
}

/* For long options that have no equivalent short option, use a
   non-character as a pseudo short option, starting with CHAR_MAX + 1.  */
enum // decode, launch
{
  DEBUGFILE_OPTION = CHAR_MAX + 1,      /* no short opt */
  DIVERSIONS_OPTION,                    /* not quite -N, because of message */
  WARN_MACRO_SEQUENCE_OPTION,           /* no short opt */

  HELP_OPTION,                          /* no short opt */
  VERSION_OPTION                        /* no short opt */
};

static const struct option long_options[] =
{
  {"arglength", required_argument, NULL, 'l'},
  {"debug", optional_argument, NULL, 'd'},
  {"define", required_argument, NULL, 'D'},
  {"error-output", required_argument, NULL, 'o'}, /* FIXME: deprecate in 2.0 */
  {"fatal-warnings", no_argument, NULL, 'E'},
  {"freeze-state", required_argument, NULL, 'F'},
  {"gnu", no_argument, NULL, 'g'},
  {"hashsize", required_argument, NULL, 'H'},
  {"include", required_argument, NULL, 'I'},
  {"interactive", no_argument, NULL, 'i'},
  {"nesting-limit", required_argument, NULL, 'L'},
  {"prefix-builtins", no_argument, NULL, 'P'},
  {"quiet", no_argument, NULL, 'Q'},
  {"reload-state", required_argument, NULL, 'R'},
  {"silent", no_argument, NULL, 'Q'},
  {"synclines", no_argument, NULL, 's'},
  {"trace", required_argument, NULL, 't'},
  {"traditional", no_argument, NULL, 'G'},
  {"undefine", required_argument, NULL, 'U'},
#ifdef ENABLE_CHANGEWORD
  {"word-regexp", required_argument, NULL, 'W'},
#endif

  {"debugfile", optional_argument, NULL, DEBUGFILE_OPTION},
  {"diversions", required_argument, NULL, DIVERSIONS_OPTION},
  {"warn-macro-sequence", optional_argument, NULL, WARN_MACRO_SEQUENCE_OPTION},

  {"help", no_argument, NULL, HELP_OPTION},
  {"version", no_argument, NULL, VERSION_OPTION},

  { NULL, 0, NULL, 0 },
};

static void // stdin cli-file-NAME conditional process
process_file (const char *name)
{
  if (STREQ (name, "-"))
    {
      push_file (stdin, "stdin", false); // stdin terminal 'm4 - file -' 
           //read stdin twice (i.e. GNU cat) for full 'syscmd' text call
    }
  else
    {
      char *full_name;
      FILE *fp = m4_path_search (name, &full_name);
      if (fp == NULL)
        {
          error (0, errno, _("cannot open `%s'"), name);
          /* Set the status to EXIT_FAILURE, even though we
             continue to process files after a missing file.  */
          retcode = EXIT_FAILURE;
          return;
        }
      push_file (fp, full_name, true);
      free (full_name);
    }
  expand_input ();
}

// POSIX requires -D, -U, -s (non-interspersed file names, ok);
// '-OPTSTRING': getopt_long->(args:file names),
//   "'\1', rather than reordering the command line."
#ifdef ENABLE_CHANGEWORD
#define OPTSTRING "-B:D:EF:GH:I:L:N:PQR:S:T:U:W:d::egil:o:st:"
#else
#define OPTSTRING "-B:D:EF:GH:I:L:N:PQR:S:T:U:d::egil:o:st:"
#endif

int
main (int argc, char *const *argv)
{
  struct sigaction act;
  macro_definition *head;       /* head of deferred argument list */
  macro_definition *tail;
  macro_definition *defn;
  int optchar;                  /* option character */

  macro_definition *defines;
  bool interactive = false;
  bool seen_file = false;
  const char *debugfile = NULL;
  const char *frozen_file_to_read = NULL;
  const char *frozen_file_to_write = NULL;
  const char *macro_sequence = "";

  set_program_name (argv[0]);
  retcode = EXIT_SUCCESS;
  setlocale (LC_ALL, "");
  bindtextdomain (PACKAGE, LOCALEDIR);
  textdomain (PACKAGE);
  atexit (close_stdin);

  include_init ();
  debug_init ();

  // Stack overflow and program error handling.
  // Ignore failure to install a crash handler.
  // We install SIGBUS and SIGSEGV handlers prior to using the c-stack module;
  // depending on the platform, c-stack will then override none, SIGSEGV, or both handlers.
  program_error_message
    = xasprintf (_("internal error detected; please report this bug to <%s>"),
                 PACKAGE_BUGREPORT);
  signal_message[SIGSEGV] = xstrdup (strsignal (SIGSEGV));
  signal_message[SIGABRT] = xstrdup (strsignal (SIGABRT));
  signal_message[SIGILL] = xstrdup (strsignal (SIGILL));
  signal_message[SIGFPE] = xstrdup (strsignal (SIGFPE));
  if (SIGBUS != SIGILL && SIGBUS != SIGSEGV)
    signal_message[SIGBUS] = xstrdup (strsignal (SIGBUS));
  sigemptyset (&act.sa_mask);
  act.sa_flags = SA_NODEFER | SA_RESETHAND;//fault handling while fault handling, default signal behavior.
  act.sa_handler = fault_handler;
  sigaction (SIGSEGV, &act, NULL);
  sigaction (SIGABRT, &act, NULL);
  sigaction (SIGILL, &act, NULL);
  sigaction (SIGFPE, &act, NULL);
  sigaction (SIGBUS, &act, NULL);
  if (c_stack_action (fault_handler) == 0)
    nesting_limit = 0;

#ifdef DEBUG_STKOVF
  // Test our fault handlers or fail (and abort).
  // Exporting/(.so extension? this is what M4 does) M4_CRASH=0, SIGSEGV; 1, assertion.
  {
    char *crash = getenv ("M4_CRASH");
    if (crash)
      {
        if (!strtol (crash, NULL, 10))
          ++*(int *) 8;
        assert (false);
        abort ();
      }
  }
#endif /* DEBUG_STKOVF */

  head = tail = NULL;// decode-arguments, size-tables, & more.

  while ((optchar = getopt_long (argc, (char **) argv, OPTSTRING,
                                 long_options, NULL)) != -1)
    switch (optchar)
      {
      default:
        usage (EXIT_FAILURE);

      case 'B':
      case 'S':
      case 'T':
        error (0, 0, _("warning: `m4 -%c' may be removed in a future release"),
               optchar);// no-ops, potentially supported elsewhere than --help
        break;

      case 'N':
      case DIVERSIONS_OPTION:
        error (0, 0, _("warning: `m4 %s' is deprecated"),
               optchar == 'N' ? "-N" : "--diversions");
        break;// no-ops since 1.4.x (-N)

      case 'D':
      case 'U':
      case 's':
      case 't':
      case '\1':
      case DEBUGFILE_OPTION:
          
        defn = (macro_definition *) xmalloc (sizeof (macro_definition));
        defn->code = optchar;
        defn->arg = optarg;//arguments, -queued
        defn->next = NULL;

        if (head == NULL)
          head = defn;
        else
          tail->next = defn;
        tail = defn;

        break;

      case 'E':
        if (! fatal_warnings)
          fatal_warnings = true;
        else
          warning_status = EXIT_FAILURE;
        break;

      case 'F':
        frozen_file_to_write = optarg;
        break;

      case 'G':
        no_gnu_extensions = 1;
        break;

      case 'H':
        hash_table_size = strtol (optarg, NULL, 10);
        if (hash_table_size == 0)
          hash_table_size = HASHMAX;
        break;

      case 'I':
        add_include_directory (optarg);
        break;

      case 'L':
        nesting_limit = strtol (optarg, NULL, 10);
        break;

      case 'P':
        prefix_all_builtins = 1;
        break;

      case 'Q':
        suppress_warnings = 1;
        break;

      case 'R':
        frozen_file_to_read = optarg;
        break;

#ifdef ENABLE_CHANGEWORD
      case 'W':
        user_word_regexp = optarg;
        break;
#endif

      case 'd':
        debug_level = debug_decode (optarg);
        if (debug_level < 0)
          {
            error (0, 0, _("bad debug flags: `%s'"), optarg);
            debug_level = 0;
          }
        break;

      case 'e':
        error (0, 0, _("warning: `m4 -e' is deprecated, use `-i' instead"));
        FALLTHROUGH;
      case 'i':
        interactive = true;
        break;

      case 'g':
        no_gnu_extensions = 0;
        break;

      case 'l':
        max_debug_argument_length = strtol (optarg, NULL, 10);
        if (max_debug_argument_length <= 0)
          max_debug_argument_length = 0;
        break;

      case 'o':
        debugfile = optarg;//WARNING: debug_set_output side effects.
        break;// (deprecated-fully, upon 2.61 autoconf) -o/--error-output (use --debugfile)

      case WARN_MACRO_SEQUENCE_OPTION:
        macro_sequence = optarg;//WARNING set_macro_sequence exit
        break;// regexp optarg null --warn-macro-sequence ("" disables warnings)

      case VERSION_OPTION:
        version_etc (stdout, PACKAGE, PACKAGE_NAME, VERSION, AUTHORS, NULL);
        exit (EXIT_SUCCESS);
        break;

      case HELP_OPTION:
        usage (EXIT_SUCCESS);
        break;
      }

  defines = head;

  if (debugfile && !debug_set_output (debugfile))
    M4ERROR ((warning_status, errno, _("cannot set debug file `%s'"),
              debugfile));// basic install

  input_init ();
  output_init ();
  symtab_init ();
  set_macro_sequence (macro_sequence);
  include_env_init ();

  if (frozen_file_to_read)
    reload_frozen_state (frozen_file_to_read);
  else
    builtin_init ();

  if (interactive)
    {
      signal (SIGINT, SIG_IGN);
      setbuf (stdout, (char *) NULL);
    };// unbuffered output interrupts

  while (defines != NULL)
    {
      macro_definition *next;
      symbol *sym;

      switch (defines->code)
        {
        case 'D':
          {
            char *macro_name = xstrdup (defines->arg);//deferred cli macros after symbol table init
            char *macro_value = strchr (macro_name, '=');
            if (macro_value)
              *macro_value++ = '\0';
            define_user_macro (macro_name, macro_value, SYMBOL_INSERT);
            free (macro_name);
          }
          break;

        case 'U':
          lookup_symbol (defines->arg, SYMBOL_DELETE);
          break;

        case 't':
          sym = lookup_symbol (defines->arg, SYMBOL_INSERT);
          SYMBOL_TRACED (sym) = true;
          break;

        case 's':
          sync_output = 1;
          break;

        case '\1':
          seen_file = true;
          process_file (defines->arg);
          break;

        case DEBUGFILE_OPTION:
          if (!debug_set_output (defines->arg))
            M4ERROR ((warning_status, errno, _("cannot set debug file `%s'"),
                      debugfile ? debugfile : _("stderr")));
          break;

        default:
          M4ERROR ((0, 0, "INTERNAL ERROR: bad code in deferred arguments"));
          abort ();
        }

      next = defines->next;
      free (defines);
      defines = next;
    }

  if (optind == argc && !seen_file)
    process_file ("-");
  else
    for (; optind < argc; optind++)
      process_file (argv[optind]);//input->file; read input

  while (pop_wrapup ())
    expand_input ();// handle-wrap expand-input 
   
  debug_set_output (NULL);// Debug stream->stderr (flush and read)
   //close_stdin() closes the "three standard streams."

  if (frozen_file_to_write)
    produce_frozen_state (frozen_file_to_write);
  else
    {
      make_diversion (0);
      undivert_all ();
    }
  output_exit ();
  free_macro_sequence ();
  exit (retcode);
}
