<script>
  import TOC from '../TOC.svelte';
  import CodeBlock from '../CodeBlock.svelte';
  import { dedent } from '$lib/code-block.js';

  let sections = [
    { id: 'genesis', title: 'The Genesis' },
    { id: 'process', title: 'The Process' },
    { id: 'importance', title: 'The Importance' },
  ];

  let shafik_yaghmour_tweet =
    'https://twitter.com/shafikyaghmour/status/1434631248824057858?s=52&t=KerxSfIBQVjFlCZn_tbYiw';

  let main_void = 'int main(void);';
  let main_with_args = 'int main(int argc, char *argv[]);';

  let asm = dedent`
            .section    __TEXT,__text,regular,pure_instructions
            .global     _main
            .p2align    2
        _main:
            mov x0, #1          ; stdout descriptor
            adr x1, hello_world ; address of the message
            mov x2, #14         ; message length (14 chars)
            mov x16, #4         ; syscall: write
            svc #0x80           ; invoke syscall

            mov x0, #0          ; return 0 (success)
            mov x16, #1         ; syscall: exit
            svc #0x80           ; invoke syscall

        hello_world: .ascii "Hello, world!\\n"
    `;

  let int_arr_hex = dedent`
		const int main[] = {
			0xd2800020,     // mov x0, #1
			0x100000e1,     // adr x1, hello_world
			0xd28001c2,     // mov x2, #14
			0xd2800090,     // mov x16, #4
			0xd4001001,     // svc #0x80

			0xd2800000,     // mov x0, #0
			0xd2800030,     // mov x16, #1
			0xd4001001,     // svc #0x80

			// ASCII encoded "Hello, world!\\n" in little-endian format
			0x6c6c6548,     // "lleH"
			0x77202c6f,     // "w ,o"
			0x646c726f,     // "dlro""
			0x00000a21      // "\\n!"
		};
	`;

  let int_arr_dec = dedent`
		const int main[] = {
			-763363296,
			268435681,
			-763362878,
			-763363184,
			-738193407,
			-763363328,
			-763363280,
			-738193407,
			1819043144,
			1998597231,
			1684828783,
			2593
		};
	`;

  let char_arr = dedent`
        const char main[] = {
            0x20, 0x00, 0x80, 0xd2,
            0xe1, 0x00, 0x00, 0x10,
            0xc2, 0x01, 0x80, 0xd2,
            0x90, 0x00, 0x80, 0xd2,
            0x01, 0x10, 0x00, 0xd4,
            0x00, 0x00, 0x80, 0xd2,
            0x30, 0x00, 0x80, 0xd2,
            0x01, 0x10, 0x00, 0xd4,
            0x48, 0x65, 0x6c, 0x6c,
            0x6f, 0x2c, 0x20, 0x77,
            0x6f, 0x72, 0x6c, 0x64,
            0x21, 0x0a, 0x00, 0x00
        };
    `;

  let lldb_image_lookup_main = dedent`
        (lldb) image lookup --name main
        1 match found in /tmp/hello-world:
                Address: hello-world[0x0000000100003f88] (hello-world.__TEXT.__text + 0)
                Summary: hello-world\`main
    `;

  let lldb_memory_read = dedent`
        (lldb) memory read --size 1 --format x 0x100003f88 0x100003fb6
        0x100003f88: 0x20 0x00 0x80 0xd2 0xe1 0x00 0x00 0x10
        0x100003f90: 0xc2 0x01 0x80 0xd2 0x90 0x00 0x80 0xd2
        0x100003f98: 0x01 0x10 0x00 0xd4 0x00 0x00 0x80 0xd2
        0x100003fa0: 0x30 0x00 0x80 0xd2 0x01 0x10 0x00 0xd4
        0x100003fa8: 0x48 0x65 0x6c 0x6c 0x6f 0x2c 0x20 0x77
        0x100003fb0: 0x6f 0x72 0x6c 0x64 0x21 0x0a
        (lldb) memory read --size 4 --format x 0x100003f88 0x100003fba
        0x100003f88: 0xd2800020 0x100000e1 0xd28001c2 0xd2800090
        0x100003f98: 0xd4001001 0xd2800000 0xd2800030 0xd4001001
        0x100003fa8: 0x6c6c6548 0x77202c6f 0x646c726f 0x00000a21
    `;
</script>

<svelte:head>
  <title>Machine Mirage in a Silicon Whisper — Faraz Vahedi</title>
</svelte:head>

<article>
  <h1>Machine Mirage in a Silicon Whisper</h1>

  <TOC {sections} />

  <p class="my-4">
    As we all get on board for our journey into the world of programming, the
    first rite of passage is invariably writing the "Hello, world!" program.
    Herein I'm revisiting this ancient tradition, but with a twist that draws
    upon the intricate ballet of machine code execution on modern AArch64 Apple
    Silicon devices. But before diving in, let me give you some context on what
    led me to this.
  </p>

  <section id="genesis">
    <h2>The Genesis</h2>
    <p>
      It all began with a
      <a class="underline" href={shafik_yaghmour_tweet}>tweet</a> from Shafik Yaghmour,
      sharing a "cursed Hello World" where an array of integers is passed to `main`,
      and somehow, against all conventions, it surprisingly prints a hello message
      on x86_64 machines. This compelled me to wonder: Why not perform this magic
      trick on my AArch64 MacBook?
    </p>
  </section>

  <section id="process">
    <h2>The Process</h2>
    <p>
      Although, technically, the provided code doesn't align with the C
      standard's defined prototypes for the main function
    </p>
    <CodeBlock code={main_void} />
    <p>or</p>
    <CodeBlock code={main_with_args} />
    <p>
      many compilers permit such definitions as they basically look for a symbol
      named main to assign it as the program's entry point—even if its signature
      doesn't match the recognised prototypes.
    </p>
    <p class="mt-2">
      Understanding that a function is essentially a pointer to the start
      location of its code, it's evident that, to put it simply, when a function
      gets invoked, the processor begins executing the machine code at that
      memory address. Thus, when we designate an array of integers with the
      intent of invoking it as a function, since those integers should follow
      the associated memory address in sequence, upon invocation it is
      anticipated to be understood as machine code. And since main represents
      the global entry point (termed "_main" on macOS or "_start" on most
      UNIX-like operating systems,) it led me to a simple hypothesis: the data
      should represent raw machine code.
    </p>
    <p class="mt-2">
      To validate this, I wrote a basic assembly program that prints "Hello,
      world!" to the console. Here's a glance at the code:
    </p>
    <CodeBlock code={asm} />
    <p>
      After compiling and delving into the code with `lldb` (though `objdump`
      could suffice as a quicker and simpler route,) a fascinating series of
      discoveries unfolded and I ensured this is how it works.
    </p>
    <p class="mt-2">
      My investigation consisted of the following steps to inspect how the
      machine code is laid out in memory:
    </p>
    <ol class="list-decimal mt-5">
      <li>
        <h3>Locating the address of the main function</h3>
        <CodeBlock code={lldb_image_lookup_main} />
      </li>
      <li>
        <h3>Reading from memory to obtain the machine code</h3>
        <p class="mt-3">
          Starting address is retrieved, now it's time to calculate the ending
          address. Since 0x100003f88 is where main starts, and the assembly code
          consists of 8 instructions, since ARM specifies that instructions are
          4 byte each here, adding 32 gives 0x100003fa8. Then, knowing that the
          length of the message is 14 bytes, adding 14 gives 0x100003fb6.
          Depending on whether an array of char or int is desired, we either
          pass 0x100003fb6 or 0x100003fb8 respectively, since for char we read 1
          byte at a time but for int we do 4 (and therefore the address needs to
          be aligned to a 4-byte boundary.)
        </p>
        <p class="mt-2">
          Below, you'll find how memory read could be performed for either char
          or int:
        </p>
        <CodeBlock code={lldb_memory_read} />
      </li>
      <li>
        <h3>Crafting the enigmatic code</h3>
        <p class="mt-3">
          With having the machine code at hand, a new form of the “Hello,
          world!” program emerged. Let's begin with the int array of hexadecimal
          numbers to better understand what is done exactly:
        </p>
        <CodeBlock code={int_arr_hex} />
        <p>
          Now if one prefers to write the same thing in decimal numbers, nothing
          differs but the look:
        </p>
        <CodeBlock code={int_arr_dec} />
        <p>
          For the char array, it's essential to consider the little-endianness.
          Neglecting this detail can result in illegal hardware instructions or
          similar errors.
        </p>
        <CodeBlock code={char_arr} />
        <p>
          Overall, once we get the machine code and we understand how the
          assembler, linker, or our C compiler in general, work, the rest is
          just a personalised game with data.
        </p>
      </li>
    </ol>
  </section>

  <section id="importance">
    <h2>The Importance</h2>
    <p>
      Why, you may ask, would a seasoned engineer, well-versed in modern
      languages, dig this deep into such low-level trickery, when it has no
      practicality and therefore no place in real world?
    </p>
    <p class="mt-2">
      You're right! But understanding the inner workings of our programming
      language, compiler, interpreter, or even the machine code and the hardware
      is more than just an academic exercise. It brings forth the following
      benefits:
    </p>
    <ol class="list-decimal mt-2">
      <li>
        <strong>Enhanced Troubleshooting & Debugging Skills</strong>:
        Recognising how instructions are executed at the machine level sharpens
        your debugging prowess.
      </li>
      <li class="mt-2">
        <strong>Expanded Horizon</strong>: It broadens your perspective, making
        you a deeper and more versatile engineer.
      </li>
      <li class="mt-2">
        <strong>Mastering Through Exploration</strong>: Pushing boundaries,
        abusing the type system, understanding standards and noticing
        limitations are just means to master and respect the art of programming.
        The more we explore, the deeper our understanding becomes.
      </li>
    </ol>
    <p class="mt-3">
      So, the essence is not to promote abusing undefined behaviours in C, but
      to appreciate the science and art behind every line of code we write. This
      exploration, reminiscent of our first "Hello, world!", reminds us that
      every professional was once a beginner and that continuous learning keeps
      that spark alive, and that even a simple "Hello, world!" is not that
      simple if seen from the other way around.
    </p>
    <p class="mt-2">
      Thus, this journey is not merely a trip down the rabbit hole; it is a
      testament to the wonders of computer science and the beauty of
      understanding the machine. Every time you write "Hello, world!", remember:
      there's always more to discover, understand, and appreciate.
    </p>
    <p class="mt-2">
      Keep your curiosity alive, explore the depths of what you know, and happy
      coding!
    </p>
  </section>
</article>
