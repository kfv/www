<script>
  import { createEventDispatcher } from 'svelte';
  import { fade } from 'svelte/transition';
  import { onMount } from 'svelte';
  import QRCode from 'qrcode';

  export let isOpen = false;

  const dispatch = createEventDispatcher();

  function closeModal() {
    dispatch('close');
  }

  function handleBackdropClick(event) {
    if (event.target === event.currentTarget) {
      closeModal();
    }
  }

  function handleKeydown(event) {
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      closeModal();
    }
  }

  const bitcoinAddress = 'bc1qgg9qvrumc746vhcwwul96xrxf44gty45r7m86m';
  const ethereumAddress = '0x225Fb6fb9Ae2c55FBbfD6c83Bc9ABcc03fFC67bA';
  const tronAddress = 'TSG7E1djQhGjzPDF58Jp3gN7MU1wyRZ5Ed';

  const cryptoWallets = [
    {
      name: 'Bitcoin',
      symbol: 'BTC',
      address: bitcoinAddress,
      icon: 'fa-brands fa-bitcoin',
    },
    {
      name: 'Ethereum',
      symbol: 'ETH',
      address: ethereumAddress,
      icon: 'fa-brands fa-ethereum',
    },
    {
      name: 'Tron',
      symbol: 'TRX',
      address: tronAddress,
      icon: 'custom-tron',
    },
  ];

  let copiedAddress = '';
  let qrPopup = null; // { wallet, qrDataURL }

  async function generateQRCode(address, walletName) {
    try {
      const isDarkMode =
        typeof document !== 'undefined' &&
        document.documentElement.classList.contains('dark');

      const qrDataURL = await QRCode.toDataURL(address, {
        width: 200,
        margin: 2,
        color: isDarkMode
          ? {
              dark: '#ffffff',
              light: '#000000',
            }
          : {
              dark: '#000000',
              light: '#ffffff',
            },
      });
      return qrDataURL;
    } catch (err) {
      console.error('Error generating QR code:', err);
      return null;
    }
  }

  async function showQRPopup(wallet) {
    const qrDataURL = await generateQRCode(wallet.address, wallet.name);
    if (qrDataURL) {
      qrPopup = { wallet, qrDataURL };
      setTimeout(() => {
        const backdrop = document.querySelector(
          '[aria-label="QR code popup backdrop"]'
        );
        if (backdrop) {
          backdrop.focus();
        }
      }, 10);
    }
  }

  function closeQRPopup() {
    qrPopup = null;
  }

  function handleQRPopupKeydown(event) {
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      closeQRPopup();
    }
  }

  function handleQRPopupClick(event) {
    if (event.target === event.currentTarget) {
      closeQRPopup();
    }
  }

  onMount(() => {
    cryptoWallets.forEach(wallet => {
      generateQRCode(wallet.address, wallet.name);
    });
  });

  $: if (isOpen) {
    setTimeout(() => {
      const backdrop = document.querySelector(
        '[role="dialog"][aria-modal="true"]'
      );
      if (backdrop) {
        backdrop.focus();
      }
    }, 10);
  }

  function copyToClipboard(text) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).catch(err => {
        console.error('Could not copy text: ', err);
      });
      copiedAddress = text;
      setTimeout(() => {
        copiedAddress = '';
      }, 2000);
    }
  }
</script>

{#if isOpen}
  <!-- Backdrop -->
  <div
    class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center"
    on:click={handleBackdropClick}
    on:keydown={handleKeydown}
    role="dialog"
    aria-modal="true"
    tabindex="-1"
  >
    <!-- Modal -->
    <div
      class="bg-white dark:bg-black border border-neutral-300 dark:border-neutral-600 rounded-lg shadow-2xl max-w-md w-full mx-4 p-6"
    >
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <h2
          class="text-xl font-semibold text-neutral-900 dark:text-neutral-100"
        >
          Support & Contribute
        </h2>
        <button
          on:click={closeModal}
          class="text-neutral-600 dark:text-neutral-200 hover:text-neutral-800 dark:hover:text-neutral-300 transition-colors"
          aria-label="Close modal"
        >
          <i class="fa-solid fa-times text-lg"></i>
        </button>
      </div>

      <!-- Content -->
      <div class="space-y-4">
        <p class="text-neutral-600 dark:text-neutral-400 text-sm">
          Your generosity helps sustain this work. Thank you for considering a
          contribution.
        </p>

        <div class="space-y-3">
          {#each cryptoWallets as wallet}
            <div
              class="border border-neutral-300 dark:border-neutral-600 rounded-lg p-4 relative"
            >
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center space-x-2">
                  {#if wallet.icon === 'custom-tron'}
                    <svg
                      class="w-5 h-5 tron-icon"
                      viewBox="0 0 64 64"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g id="tron">
                        <path
                          d="M61.55,19.28c-3-2.77-7.15-7-10.53-10l-.2-.14a3.82,3.82,0,0,0-1.11-.62l0,0C41.56,7,3.63-.09,2.89,0a1.4,1.4,0,0,0-.58.22L2.12.37a2.23,2.23,0,0,0-.52.84l-.05.13v.71l0,.11C5.82,14.05,22.68,53,26,62.14c.2.62.58,1.8,1.29,1.86h.16c.38,0,2-2.14,2-2.14S58.41,26.74,61.34,23a9.46,9.46,0,0,0,1-1.48A2.41,2.41,0,0,0,61.55,19.28ZM36.88,23.37,49.24,13.12l7.25,6.68Zm-4.8-.67L10.8,5.26l34.43,6.35ZM34,27.27l21.78-3.51-24.9,30ZM7.91,7,30.3,26,27.06,53.78Z"
                        />
                      </g>
                    </svg>
                  {:else}
                    <i class="text-lg {wallet.icon}"></i>
                  {/if}
                  <span
                    class="font-medium text-neutral-900 dark:text-neutral-100"
                  >
                    {wallet.name} ({wallet.symbol})
                  </span>
                </div>
              </div>

              <div class="flex items-center space-x-2">
                <code
                  class="text-xs text-neutral-700 dark:text-neutral-200 bg-neutral-100 dark:bg-neutral-900 px-2 py-1 rounded flex-1 truncate"
                  title={wallet.address}
                >
                  {wallet.address}
                </code>
                <button
                  on:click={() => showQRPopup(wallet)}
                  class="px-2 py-1 text-xs rounded hover:bg-neutral-200 dark:hover:bg-neutral-700 hover:text-neutral-800 dark:hover:text-white transition-colors w-6 h-6 flex items-center justify-center flex-shrink-0"
                  aria-label="Show QR code for {wallet.name}"
                >
                  <i class="fa-solid fa-qrcode"></i>
                </button>
                <button
                  on:click={() => copyToClipboard(wallet.address)}
                  class="px-2 py-1 text-xs rounded hover:bg-neutral-200 dark:hover:bg-neutral-700 hover:text-neutral-800 dark:hover:text-white transition-colors w-6 h-6 flex items-center justify-center flex-shrink-0"
                  aria-label="Copy {wallet.name} address"
                >
                  {#if copiedAddress !== wallet.address}
                    <i in:fade={{ duration: 500 }} class="fa-regular fa-copy"
                    ></i>
                  {/if}
                  {#if copiedAddress === wallet.address}
                    <i in:fade={{ duration: 500 }} class="fa-regular fa-check"
                    ></i>
                  {/if}
                </button>
              </div>
            </div>
          {/each}
        </div>

        <p class="text-xs text-neutral-500 text-center mt-4">
          Thank you for your support!
        </p>
      </div>
    </div>
  </div>

  <!-- QR Code Popup -->
  {#if qrPopup}
    <div
      class="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center"
      on:click={handleQRPopupClick}
      on:keydown={handleQRPopupKeydown}
      role="dialog"
      aria-modal="true"
      aria-labelledby="qr-popup-title"
      tabindex="0"
      aria-label="QR code popup backdrop"
    >
      <div
        class="bg-white dark:bg-black border border-neutral-300 dark:border-neutral-600 rounded-lg shadow-2xl max-w-sm w-full mx-4 p-6"
        on:click|stopPropagation
        on:keydown={() => {}}
        role="dialog"
        aria-modal="true"
        tabindex="0"
      >
        <!-- Header -->
        <div class="flex items-center justify-between mb-4">
          <div class="flex-1"></div>
          <div class="flex items-center space-x-2">
            {#if qrPopup.wallet.icon === 'custom-tron'}
              <svg
                class="w-6 h-6 tron-icon"
                viewBox="0 0 64 64"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="tron">
                  <path
                    d="M61.55,19.28c-3-2.77-7.15-7-10.53-10l-.2-.14a3.82,3.82,0,0,0-1.11-.62l0,0C41.56,7,3.63-.09,2.89,0a1.4,1.4,0,0,0-.58.22L2.12.37a2.23,2.23,0,0,0-.52.84l-.05.13v.71l0,.11C5.82,14.05,22.68,53,26,62.14c.2.62.58,1.8,1.29,1.86h.16c.38,0,2-2.14,2-2.14S58.41,26.74,61.34,23a9.46,9.46,0,0,0,1-1.48A2.41,2.41,0,0,0,61.55,19.28ZM36.88,23.37,49.24,13.12l7.25,6.68Zm-4.8-.67L10.8,5.26l34.43,6.35ZM34,27.27l21.78-3.51-24.9,30ZM7.91,7,30.3,26,27.06,53.78Z"
                  />
                </g>
              </svg>
            {:else}
              <i class="text-xl {qrPopup.wallet.icon}"></i>
            {/if}
            <h3
              id="qr-popup-title"
              class="text-lg font-semibold text-neutral-900 dark:text-neutral-100"
            >
              {qrPopup.wallet.name} ({qrPopup.wallet.symbol})
            </h3>
          </div>
          <button
            on:click={closeQRPopup}
            class="text-neutral-600 dark:text-neutral-200 hover:text-neutral-800 dark:hover:text-neutral-300 transition-colors flex-1 text-right"
            aria-label="Close QR code"
          >
            <i class="fa-solid fa-times text-lg"></i>
          </button>
        </div>

        <!-- QR Code -->
        <div class="flex justify-center">
          <img
            src={qrPopup.qrDataURL}
            alt="QR code for {qrPopup.wallet.name} address"
            class="w-48 h-48 bg-white rounded border border-neutral-300 dark:border-neutral-600"
          />
        </div>
      </div>
    </div>
  {/if}
{/if}

<style>
  .tron-icon path {
    fill: #000000;
  }

  :global(.dark) .tron-icon path {
    fill: #ffffff;
  }
</style>
