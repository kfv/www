<svelte:head>
  <title>About — Faraz Vahedi</title>
</svelte:head>

<div class="flex justify-between">
  <h1 class="font-bold">Faraz Vahedi</h1>
  <!-- Contact -->
  <div
    class="my-3 text-neutral-700/80 dark:text-neutral-400
                  float-right"
  >
    <div class="mt-3 mb-5">
      <a
        class="box-border border border-neutral-700/80
                    rounded-lg p-3 w-fit duration-500
                    hover:text-white hover:bg-black
                    dark:hover:bg-white dark:hover:text-black"
        href="/about/cv.pdf"
      >
        Download PDF
      </a>
    </div>
    <div class="my-3 grid border-l border-neutral-800">
      <a
        class="mx-3 hover:text-black dark:hover:text-neutral-100
                    duration-500"
        href="https://kfv.io/"
      >
        <i class="mr-1 sm:mr-2 fa-solid fa-globe"></i>
        kfv.io
      </a>
      <a
        class="mx-3 hover:text-black dark:hover:text-neutral-100
                    duration-500"
        href="mailto:kfv@kfv.io"
      >
        <i class="mr-1 sm:mr-2 fa-solid fa-envelope"></i>
        kfv@kfv.io
      </a>
      <a
        class="mx-3 hover:text-black dark:hover:text-neutral-100
                    duration-500"
        href="https://github.com/kfv"
      >
        <i class="mr-1 sm:mr-2 fa-brands fa-github"></i>
        github.com/kfv
      </a>
      <a
        class="mx-3 hover:text-black dark:hover:text-neutral-100
                    duration-500"
        href="https://www.linkedin.com/in/kfv"
      >
        <i class="mr-1 sm:mr-2 fa-brands fa-linkedin"></i>
        linkedin.com/in/kfv
      </a>
      <a
        class="mx-3 hover:text-black dark:hover:text-neutral-100
                    duration-500"
        href="tel:+989214370485"
      >
        <i class="mr-1 sm:mr-2 fa-solid fa-phone"></i>
        +98 921 437 0485
      </a>
    </div>
  </div>
</div>

<!-- Overview -->
<div class="flex flex-wrap-reverse">
  <h2 class="my-0 mr-2 font-bold">OVERVIEW</h2>
  <hr class="flex-grow mb-2 border-neutral-800" />
</div>
<div class="my-3">
  <p>
    Senior Software Engineer with deep expertise in operating systems development,
    compiler tooling, and network programming. Specialising in systems-level C, C++,
    Rust, and Go development with proven record on performance-critical
    infrastructure at scale. Active contributor to the
    <a href="https://www.freebsd.org" class="hover:underline">FreeBSD Project</a>, delivering improvements to
    core system components, ports, and documentation. Committed to standards
    compliance whilst actively following programming languages design and
    implementation across evolving ecosystems.
  </p>
</div>

<!-- Skills -->
<div class="flex flex-wrap-reverse">
  <h2 class="my-0 mr-2 font-bold">SKILLS</h2>
  <hr class="flex-grow mb-2 border-neutral-800" />
</div>
<div class="my-3">
  <ul class="list-disc list-outside ml-10 my-3">
    <li>
      <strong>Programming Languages:</strong> C and C++ for systems programming,
      embedded development, and compiler tooling; Rust and Go for systems and
      backend services.
    </li>
    <li>
      <strong>Operating Systems:</strong> Deep knowledge of UNIX internals with
      extensive experience with BSD, illumos, and Linux families in both
      development and production environments.
    </li>
    <li>
      <strong>Systems Programming:</strong> Socket programming, IPC mechanisms,
      event notification mechanisms, BPF, Netmap, Netgraph, DTrace, concurrency
      primitives, sandboxing techniques, and low-level debugging and
      instrumentation techniques.
    </li>
    <li>
      <strong>Virtualisation:</strong> Extensive production experience with both
      OS-level (FreeBSD jails, illumos zones, OCI-compliant containers) and
      hardware-level (bhyve, QEMU) virtualisation techniques.
    </li>
    <li>
      <strong>Infrastructure:</strong> Automation, orchestration, monitoring,
      observability, alerting, load balancing, high-availability, vulnerability
      assessment, and operating systems hardening.
    </li>
    <li>
      <strong>Cloud Platforms:</strong> AWS (EC2, ELB, EKS, ECS, S3, RDS,
      CloudWatch.)
    </li>
  </ul>
</div>

<!-- Employment History -->
<div class="flex flex-wrap-reverse">
  <h2 class="my-0 mr-2 font-bold">EMPLOYMENT HISTORY</h2>
  <hr class="flex-grow mb-2 border-neutral-800" />
</div>
<!-- FreeBSD Project -->
<div class="flex justify-between mt-3">
  <h3 class="font-bold">
    <a href="https://www.freebsd.org" class="hover:underline">FreeBSD Project</a>
  </h3>
  <p class="italic">open source</p>
</div>
<div class="flex justify-between">
  <p class="italic">Src and Ports Contributor</p>
  <p class="italic">Jan. 2021 - Present</p>
</div>
<div class="my-3">
  <ul class="list-disc list-outside ml-10">
    <li>
      Contribute to base system (src) focusing on code correctness,
      standards compliance, performance optimisation, and security hardening
      across core components.
    </li>
    <li>
      Contribute to system documentation and manual pages to improve
      technical clarity, accuracy, and developer experience.
    </li>
    <li>
      Maintain and improve multiple ports, ensuring compatibility and
      addressing build system issues.
    </li>
  </ul>
</div>

<!-- SkunkWerks -->
<div class="flex justify-between mt-3">
  <h3 class="font-bold">
    <a href="https://skunkwerks.at" class="hover:underline">SkunkWerks</a>
  </h3>
  <p class="italic">contract</p>
</div>
<div class="flex justify-between">
  <p class="italic">Software Engineer</p>
  <p class="italic">Nov. 2023 - Present</p>
</div>
<div class="my-3">
  <ul class="list-disc list-outside ml-10">
    <li>
      Architecting and developing a secure, highly customisable CI/CD
      platform, optimised for high-performance systems execution and adaptable
      across diverse OS-level virtualisation environments, enabling robust and
      scalable core pipeline operations.
    </li>
  </ul>
</div>
<!-- OMPFinex -->
<div class="flex justify-between mt-3">
  <h3 class="font-bold">
    <a href="https://www.ompfinex.com" class="hover:underline">OMPFinex</a>
  </h3>
  <p class="italic">full-time</p>
</div>
<div class="flex justify-between">
  <p class="italic">Software Engineer, Site Reliability Engineer</p>
  <p class="italic">Nov. 2023 - Present</p>
</div>
<div class="my-3">
  <ul class="list-disc list-outside ml-10">
    <li>
      Architected and delivered operator-centric CRM backend and
      multi-channel notification system in Go, processing millions of requests
      daily with deep integration to external platforms and identity services.
    </li>
    <li>
      Contributed to development of high-throughput blockchain transaction
      monitoring systems in Go, processing and analysing real-time data streams
      for trading platform operations.
    </li>
    <li>
      Designed and implemented critical system utilities in C, Rust, and Go,
      for operational workflows, monitoring, and low-level system integration.
    </li>
    <li>
      Managed multi-zone Kubernetes clusters across multiple cloud
      providers, ensuring high-availability with automated failover and
      load balancing.
    </li>
    <li>
      Led architectural design discussions and code reviews, establishing
      standards for code quality, style, security, and maintainability.
    </li>
    <li>
      Mentored Go team developers and conducted technical interviews,
      contributing to hiring decisions, onboarding new employees, and uplifting
      engineering culture and standards.
    </li>
  </ul>
</div>
<!-- illuria Security -->
<div class="flex justify-between mt-3">
  <h3 class="font-bold">
    <a href="https://illuria.com" class="hover:underline">illuria Security</a>
  </h3>
  <p class="italic">full-time</p>
</div>
<div class="flex justify-between">
  <p class="italic">Software Engineer, Site Reliability Engineer</p>
  <p class="italic">Jan. 2022 - Jun. 2023</p>
</div>
<div class="my-3">
  <ul class="list-disc list-outside ml-10">
    <li>
      Led infrastructure and release engineering teams, architecting
      deployment systems for customer environments with focus on reproducibility and
      zero-trust principles.
    </li>
    <li>
      Engineered automated FreeBSD distribution build system with custom
      package repository and delivery pipelines.
    </li>
    <li>
      Developed performance monitoring and system utilities in C and Rust,
      leveraging DTrace for deep system observability and bottleneck analysis.
    </li>
    <li>
      Architected and deployed comprehensive CI/CD pipelines with security
      scanning, automated end-to-end testing, progressive rollout strategies, and
      heavily customised execution environment.
    </li>
    <li>
      Optimised large-scale FreeBSD jail orchestration, improving update
      efficiency and deployment speed.
    </li>
  </ul>
</div>
<!-- Khallagh Borhan -->
<div class="flex justify-between mt-3">
  <h3 class="font-bold">Khallagh Borhan</h3>
  <p class="italic">full-time</p>
</div>
<div class="flex justify-between">
  <p class="italic">Software Engineer</p>
  <p class="italic">Mar. 2021 - May. 2021</p>
</div>
<div class="my-3">
  <ul class="list-disc list-outside ml-10">
    <li>
      Architected and implemented high-performance DDoS mitigation system
      in C++, providing real-time traffic analysis and automated threat response.
    </li>
    <li>
      Developed kernel-level network monitoring solution using Berkeley
      Packet Filter (BPF) and Netmap framework in C, achieving line-rate packet
      processing.
    </li>
    <li>
      Optimised network stack and application performance through profiling
      and systems-level tuning whilst ensuring security and reliability.
    </li>
  </ul>
</div>
<div class="flex justify-between">
  <p class="italic">Software Engineer, Site Reliability Engineer</p>
  <p class="italic">Jan. 2019 - Feb. 2021</p>
</div>
<div class="my-3">
  <ul class="list-disc list-outside ml-10">
    <li>
      Architected and delivered Platform-as-a-Service (PaaS) solution,
      enabling both internal teams and customers to rapidly deploy and scale
      applications.
    </li>
    <li>
      Developed custom Kubernetes cluster management and automation tools,
      streamlining operations and reducing manual intervention.
    </li>
    <li>
      Reduced deployment times by 70% through CI/CD pipeline optimisation
      and intelligent caching strategies, eliminating vendor lock-in and enabling
      faster and more reliable deployments.
    </li>
    <li>
      Improved performance of a public video streaming platform by 80%
      through complete infrastructure redesign, architectural optimisation, and
      refactoring of legacy Java code.
    </li>
    <li>
      Identified and resolved critical memory leaks in core services,
      reducing memory footprint by 75% and eliminating cascading failures.
    </li>
    <li>
      Utilised OS-level virtualisation techniques with distributed storage
      backend, improving deployment flexibility and resource utilisation.
    </li>
    <li>
      Contributed to the internal Infrastructure-as-a-Service (IaaS) and 
      Content Delivery Network (CDN) solutions, diagnosing and resolving complex
      system-level issues, improving system availability and reliability.
    </li>
  </ul>
</div>
<!-- Emersun -->
<div class="flex justify-between mt-3">
  <h3 class="font-bold">
    <a href="https://emersun.com" class="hover:underline">Emersun</a>
  </h3>
  <p class="italic">full-time</p>
</div>
<div class="flex justify-between">
  <p class="italic">Software Engineer, Site Reliability Engineer</p>
  <p class="italic">Dec. 2017 - Mar. 2019</p>
</div>
<div class="my-3">
  <ul class="list-disc list-outside ml-10">
    <li>
      Architected and built complete production infrastructure from scratch
      using FreeBSD jails, bhyve, and ZFS, with focus on security, scalability,
      and operational sustainability.
    </li>
    <li>
      Automated large-scale, declarative infrastructure and service
      orchestration with Terraform and Nomad, facilitating infrastructure
      management and service deployment at scale.
    </li>
    <li>
      Engineered comprehensive monitoring, alerting, and observability
      systems with custom tooling, providing real-time visibility into system
      health, performance metrics, and capacity planning.
    </li>
    <li>
      Optimised ZFS storage subsystem with deduplication, compression, and
      L2ARC/ZIL tiered caching, improving I/O throughput by 40%.
    </li>
    <li>
      Contributed to Java application codebase and database design,
      collaborating with development team on architectural decisions.
    </li>
    <li>
      Mentored engineering team members and participated in technical
      hiring, evaluating candidates and contributing to team growth.
    </li>
  </ul>
</div>

<!-- Volunteer Work -->
<div class="flex flex-wrap-reverse">
  <h2 class="my-0 mr-2 font-bold">VOLUNTEER WORK</h2>
  <hr class="flex-grow mb-2 border-neutral-800" />
</div>
<div class="my-3">
  <ul class="list-disc list-outside ml-10">
    <li>
      Organised
      <span class="italic">Iran BSD User Group (IRBUG)</span>
      (<span class="italic">April 2019</span>-<span class="italic">January 2021</span>)
    </li>
    <li>
      Translated
      <span class="italic">HTTP3-Explained</span>
      to Persian
    </li>
  </ul>
</div>
