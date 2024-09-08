<svelte:head>
    <title>About — Faraz Vahedi</title>
</svelte:head>

<div class="flex justify-between">
    <h1 class="font-bold">
        Faraz Vahedi
    </h1>
    <!-- Contact -->
    <div class="my-3 text-neutral-700/80 dark:text-neutral-400
                  float-right">
        <div class="mt-3 mb-5">
            <a class="box-border border border-neutral-700/80
                    rounded-lg p-3 w-fit duration-500
                    hover:text-white hover:bg-black
                    dark:hover:bg-white dark:hover:text-black"
               href="/about/cv.pdf">
                Download PDF
            </a>
        </div>
        <div class="my-3 grid border-l border-neutral-800">
            <a class="mx-3 hover:text-black dark:hover:text-neutral-100
                    duration-500"
               href="https://kfv.io/">
                <i class="mr-1 sm:mr-2 fa-solid fa-globe"></i>
                kfv.io
            </a>
            <a class="mx-3 hover:text-black dark:hover:text-neutral-100
                    duration-500"
               href="mailto:kfv@kfv.io">
                <i class="mr-1 sm:mr-2 fa-solid fa-envelope"></i>
                kfv@kfv.io
            </a>
            <a class="mx-3 hover:text-black dark:hover:text-neutral-100
                    duration-500"
               href="https://github.com/kfv">
                <i class="mr-1 sm:mr-2 fa-brands fa-github"></i>
                github.com/kfv
            </a>
            <a class="mx-3 hover:text-black dark:hover:text-neutral-100
                    duration-500"
               href="https://www.linkedin.com/in/kfv">
                <i class="mr-1 sm:mr-2 fa-brands fa-linkedin"></i>
                linkedin.com/in/kfv
            </a>
            <a class="mx-3 hover:text-black dark:hover:text-neutral-100
                    duration-500"
               href="tel:+989214370485">
                <i class="mr-1 sm:mr-2 fa-solid fa-phone"></i>
                +98 921 437 0485
            </a>
        </div>
    </div>
</div>

<!-- Overview -->
<div class="flex flex-wrap-reverse">
    <h2 class="my-0 mr-2 font-bold">
        OVERVIEW
    </h2>
    <hr class="flex-grow mb-2 border-neutral-800">
</div>
<div class="my-3">
    <p>
        Senior Software Engineer with extensive expertise in C, C++, Rust, and ARM
        Assembly, specialising in compilers and operating systems. Demonstrated
        commitment to secure coding standards, architectural design principles, and the
        consistent delivery of robust, reliable, and efficient software solutions.
        Driven by challenging projects and aiming to contribute actively to
        international standard committees, with aspirations to join WG14 and WG21.
        Passionately working towards making impactful contributions to open source
        communities, especially the LLVM and Rust projects (while being an active
        contributor to the FreeBSD project.) Dedicated to continuous growth, knowledge
        sharing, and pushing the boundaries of software engineering.
    </p>
</div>

<!-- Skills -->
<div class="flex flex-wrap-reverse">
    <h2 class="my-0 mr-2 font-bold">
        SKILLS
    </h2>
    <hr class="flex-grow mb-2 border-neutral-800">
</div>
<div class="my-3">
    <p>
        Commanding in the realm of system programming, expertise spans across
        compilers, operating systems, and embedded development. Enriched by a
        broad spectrum of programming languages and technologies, distinctive
        traits encompass profound problem-solving insights, leadership prowess,
        a team orientation, and a precision-focused approach to engineering
        solutions intertwining threads of reliability, scalability, and
        efficiency.
    </p>
    <ul class="list-disc list-outside ml-10 my-3">
        <li>
            Excel in using C, C++, Rust, and ARM Assembly, with additional
            hands-on experience in Swift, LISP, Haskell, Python, Go, Java,
            Kotlin, Fortran, Forth, Ruby, Pascal, JavaScript, and POSIX shell
            scripts.
        </li>
        <li>
            Uphold secure coding standards, prioritising clean code, system
            scalability, high availability, and operational efficiency.
        </li>
        <li>
            Command a deep understanding and practical expertise in UNIX
            internals, actively utilising and developing system utilities and
            kernel modules for BSD (primarily FreeBSD and OpenBSD,) Linux
            (various distributions including RedHat, SUSE, and Ubuntu,) illumos
            (OmniOS,) and macOS.
        </li>
        <li>
            Exhibit adeptness at various Interprocess Communication (IPC)
            methods from Signals and UNIX Domain Sockets to Network Sockets,
            Message Queues, and Memory-Mapped Files.
        </li>
        <li>
            Showcase proficiency in socket programming and different event
            notification mechanisms to address c10k problem, with deep
            understanding of both connection-oriented and connectionless
            protocols with hands-on experience developing critically performant
            client-server applications.
        </li>
        <li>
            Possess advanced knowledge and demonstrated expertise in the
            application and refinement of optimisation techniques, ensuring peak
            performance and efficiency in diverse software environments.
        </li>
        <li>
            Maintain deep insights into compiler design and adeptly develop
            frontends for both General Purpose Languages (GPL) and Domain
            Specific Languages (DSL) on platforms like LLVM.
        </li>
        <li>
            Express good understanding of API architectural styles including
            SOAP, REST, GraphQL, RPC, and gRPC, with hands-on experience
            developing RESTful and GraphQL based APIs.
        </li>
        <li>
            Navigate the fields of software development, system architecture,
            infrastructure management, and release engineering with insight and
            proficiency.
        </li>
        <li>
            Construct effective CI/CD pipelines, automate testing, and
            package-building procedures, ensuring seamless and efficient
            workflows.
        </li>
        <li>
            Exemplify proactive leadership and management, cultivating a dynamic
            and cooperative atmosphere for technical teams.
        </li>
        <li>
            Emphasise knowledge sharing and collective growth as a dedicated and
            collaborative team member, contributing positively to team dynamics
            and project success.
        </li>
    </ul>
</div>

<!-- Employment History -->
<div class="flex flex-wrap-reverse">
    <h2 class="my-0 mr-2 font-bold">
        EMPLOYMENT HISTORY
    </h2>
    <hr class="flex-grow mb-2 border-neutral-800">
</div>
<!-- SkunkWerks GmbH -->
<div class="flex justify-between mt-3">
    <h3 class="font-bold">
        SkunkWerks GmbH
    </h3>
    <p class="italic">
        contract
    </p>
</div>
<div class="flex justify-between">
    <p class="italic">
        Software Engineer
    </p>
    <p class="italic">
        Nov. 2023 - Present
    </p>
</div>
<div class="my-3">
    <ul class="list-disc list-outside ml-10">
        <li>
            Designing and implementing a customisable CI/CD runner in C,
            utilising FreeBSD Jails as the primary OS-level virtualisation
            provider while focused on expanding support to a wider range of
            operating systems and virtualisation providers to enhance the
            flexibility and scalability of the CI/CD system.
        </li>
    </ul>
</div>
<!-- OMPFinex -->
<div class="flex justify-between mt-3">
    <h3 class="font-bold">
        OMPFinex
    </h3>
    <p class="italic">
        full-time
    </p>
</div>
<div class="flex justify-between">
    <p class="italic">
        Site Reliability Engineer / Software Engineer
    </p>
    <p class="italic">
        Nov. 2023 - Present
    </p>
</div>
<div class="my-3">
    <ul class="list-disc list-outside ml-10">
        <li>
            Responsible for system architecture—designing and maintaining robust
            solutions for a trading and digital exchange platform.
        </li>
        <li>
            Developing and implementing a transaction watcher platform for
            various blockchain networks, initially focusing on the Solana
            network.
        </li>
        <li>
            Managing Kubernetes clusters and Mikrotik routers across multiple
            zones to ensure high availability and reliability.
        </li>
        <li>
            Optimising edge services, CI/CD pipelines, IaC workflows, and
            monitoring and log management platforms, contributing to the
            continuous improvement of deployment processes.
        </li>
        <li>
            Developing system and network utilities to facilitate everyday
            operations, ensuring efficient and reliable workflows.
        </li>
        <li>
            Serving as an on-call member for operations and site reliability,
            addressing critical issues to maintain seamless platform
            functionality.
        </li>
        <li>
            Collaborating with cross-functional teams to implement scalable and
            efficient solutions, driving the company's technical and operational
            success.
        </li>
        <li>
            Authoring and maintaining RFCs to establish and improve policies and
            guidelines, fostering better development practices and operational
            standards.
        </li>
    </ul>
</div>
<!-- illuria Security, Inc. -->
<div class="flex justify-between mt-3">
    <h3 class="font-bold">
        illuria Security, Inc.
    </h3>
    <p class="italic">
        full-time
    </p>
</div>
<div class="flex justify-between">
    <p class="italic">
        Systems Engineer
    </p>
    <p class="italic">
        Jan. 2022 - Jun. 2023
    </p>
</div>
<div class="my-3">
    <ul class="list-disc list-outside ml-10">
        <li>
            Co-led the infrastructure and release-engineering teams,
            driving the formulation and execution of key strategies aimed at
            elevating system scalability, security, and high availability.
        </li>
        <li>
            Devised optimal strategies to minimise the load on network
            bandwidth and IOPS during concurrent large-scale upgrades of
            FreeBSD jails, thereby enhancing the efficiency of system updates.
        </li>
        <li>
            Developed an automated system to create internally customised
            FreeBSD distribution images in various formats, including raw, ISO
            9660, VHD, and VDI—upon the initiation of a new release.
        </li>
        <li>
            Constructed effective CI/CD pipelines integrated with exhaustive
            continuous testing procedures, guaranteeing efficient software
            delivery and seamless swift deployments.
        </li>
        <li>
            Utilised Poudriere to automate testing and package building
            procedures, whilst maintaining a public package repository for client
            use, facilitating seamless access to the most recent software
            updates.
        </li>
        <li>
            Engineered a diverse suite of internal applications using Rust (for
            APIs and system utilities,) C (for system utilities,) DTrace (for
            dynamic instrumentation of production systems and data collection
            from operational services and protocols,) POSIX shell scripts, and
            Oberon.
        </li>
        <li>
            Developed and managed an extensive monitoring and alerting system
            using custom shell, Python, and DTrace scripts, improving system
            visibility and enabling proactive issue resolution.
        </li>
        <li>
            Designed and implemented a holistic documentation platform, enabling
            seamless delivery of critical information in the form of wikis and
            books—significantly streamlining data accessibility, boosting team
            productivity, and fostering knowledge sharing.
        </li>
    </ul>
</div>
<!-- Khallagh Borhan, Inc. -->
<div class="flex justify-between mt-3">
    <h3 class="font-bold">
        Khallagh Borhan, Inc.
    </h3>
    <p class="italic">
        full-time
    </p>
</div>
<div class="flex justify-between">
    <p class="italic">
        Software Engineer
    </p>
    <p class="italic">
        Mar. 2021 - May. 2021
    </p>
</div>
<div class="my-3">
    <ul class="list-disc list-outside ml-10">
        <li>
            Rejoined Khallagh's Research & Development team, leading the
            design and implementation of a customisable DDoS protection suite
            for the company's CDN services.
        </li>
        <li>
            Engineered a modular system integrating with local services,
            enabling streamlined and effective threat mitigation while
            maintaining the integrity of the CDN operations.
        </li>
        <li>
            Led the rapid design, coding, and refinement of the
            anomaly detection platform amidst tight deadlines; judiciously
            employed BSD sockets, Berkeley Packet Filter, Netmap, and SQLite
            API to produce a high-performance but minimal solution within
            stringent budget and time constraints.
        </li>
        <li>
            Collaborated with interdisciplinary teams, ensuring that the
            solution was seamlessly integrated with existing infrastructure,
            optimising overall system security and performance.
        </li>
        <li>
            Successfully met the aggressive three-month project timeline by
            implementing agile methodologies and close collaboration,
            delivering the suite on time.
        </li>
        <li>
            Contributed to post-launch optimisations and handed over
            detailed documentation to ensure smooth integration with future
            developments, emphasising maintainability and scalability.
        </li>
    </ul>
</div>
<div class="flex justify-between">
    <p class="italic">
        Lead DevOps Engineer
    </p>
    <p class="italic">
        Apr. 2019 - Feb. 2020
    </p>
</div>
<div class="my-3">
    <ul class="list-disc list-outside ml-10">
        <li>
            Led the design and implementation of the company's PaaS solution,
            optimising the integration of internal applications while also
            supporting a broad spectrum of external client applications.
        </li>
        <li>
            Collaborated closely with other teams, offering support in
            troubleshooting and resolving issues during their migration to the
            new infrastructure and the development of the public-facing
            interface.
        </li>
        <li>
            Developed an interactive agentless Kubernetes cluster provisioner and
            manager, designed to simplify scaling operations and routine
            maintenance procedures.
        </li>
        <li>
            Automated the build process and sped up deployments by 80% through
            the implementation of Continuous Tests and the leveraging of CI/CD
            pipelines.
        </li>
        <li>
            Trained NOC personnel on understanding cluster metrics and
            maintaining the platform.
        </li>
    </ul>
</div>
<div class="flex justify-between">
    <p class="italic">
        DevOps Engineer
    </p>
    <p class="italic">
        Sept. 2016 - Dec. 2018
    </p>
</div>
<div class="my-3">
    <ul class="list-disc list-outside ml-10">
        <li>
            Rearchitected the infrastructure of a multimedia streaming
            platform, boosting overall performance by 80% and achieving 99.9%
            uptime.
        </li>
        <li>
            Identified an improper reference model in the application, leading
            to the resolution of memory leaks and a 75% reduction in memory
            usage, from 64GB down to 16GB.
        </li>
        <li>
            Increased delivery velocity by 70% through introducing Continuous
            Tests and creating a sustainable DevOps culture.
        </li>
        <li>
            Employed OS-level virtualisation using LXC/LXD (later transitioned
            to Docker,) markedly reducing overheads associated with full-weight
            virtualisation when it was deemed unnecessary.
        </li>
        <li>
            Implemented Distributed Replicated GlusterFS volumes, improving
            data redundancy and overall system reliability.
        </li>
        <li>
            Collaborated closely with the Security Operations Centre (SOC)
            department, playing a vital role in penetration testing. This
            collaboration resulted in actionable insights that significantly
            bolstered system security.
        </li>
        <li>
            Identified potential vulnerabilities and proposed remediation
            measures, enhancing the security framework and ensuring compliance
            with industry best practices.
        </li>
    </ul>
</div>
<!-- Bidopin -->
<div class="flex justify-between mt-3">
    <h3 class="font-bold">
        Bidopin
    </h3>
    <p class="italic">
        full-time
    </p>
</div>
<div class="flex justify-between">
    <p class="italic">
        DevOps Engineer
    </p>
    <p class="italic">
        Dec. 2017 - Mar. 2019
    </p>
</div>
<div class="my-3">
    <ul class="list-disc list-outside ml-10">
        <li>
            Assisted the engineering department in overcoming setbacks by
            implementing a trusted DevOps culture and aligning Business-IT
            objectives.
        </li>
        <li>
            Architected an infrastructure to ensure high availability and
            consolidated databases, leading to a 70% reduction in costs.
        </li>
        <li>
            Leveraged FreeBSD jails for OS-level virtualisation, to enhance
            system performance and scalability.
        </li>
        <li>
            Heavily utilised and optimised ZFS filesystem, maximising data
            integrity and facilitating efficient snapshots, replication, and
            data compression for effective storage management.
        </li>
        <li>
            Leveraged ZFS deduplication and tiered caching (ARC and L2ARC)
            capabilities to optimise storage performance, ensuring high
            availability and fast recovery in large-scale environments.
        </li>
        <li>
            Developed and managed robust CI/CD pipelines to automate
            deployments, improve system testing, and speed up the release
            cycle.
        </li>
        <li>
            Defined thorough backup and upgrade policies to safeguard
            system data and ensure seamless software updates.
        </li>
    </ul>
</div>


<!-- Volunteer Work -->
<div class="flex flex-wrap-reverse">
    <h2 class="my-0 mr-2 font-bold">
        VOLUNTEER WORK
    </h2>
    <hr class="flex-grow mb-2 border-neutral-800">
</div>
<div class="my-3">
    <ul class="list-disc list-outside ml-10">
        <li>
            Organised
            <span class="italic">
                Iran BSD User Group (IRBUG)
            </span>
            from
            <span class="italic">
                April 2019
            </span>
            to
            <span class="italic">
                January 2021.
            </span>
            Initiated regular workshops and monthly
            meetings to foster knowledge sharing and collaboration
            among members.
        </li>
        <li>
            Translated
            <span class="italic">
                HTTP3-Explained
            </span>
            from English into Persian.
        </li>
    </ul>
</div>
