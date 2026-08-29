<script>
  import { fade } from 'svelte/transition';
  import QRCode from 'qrcode';
  import { wallets } from './wallets.js';
  import './SupportWallets.css';

  let copiedAddress = '';
  let openSymbol = '';
  let qrData = {};

  export function collapse() {
    if (!openSymbol) return false;
    openSymbol = '';
    return true;
  }

  async function toggleQr(wallet) {
    if (openSymbol === wallet.symbol) {
      openSymbol = '';
      return;
    }

    if (!qrData[wallet.symbol]) {
      try {
        const dataUrl = await QRCode.toDataURL(wallet.address, {
          width: 176,
          margin: 1,
          color: { dark: '#ffffff', light: '#000000' },
        });
        qrData = { ...qrData, [wallet.symbol]: dataUrl };
      } catch (err) {
        console.error('Error generating QR code:', err);
        return;
      }
    }

    openSymbol = wallet.symbol;
  }

  function copyAddress(address) {
    if (!navigator.clipboard) return;
    navigator.clipboard.writeText(address).catch(err => {
      console.error('Could not copy text: ', err);
    });
    copiedAddress = address;
    setTimeout(() => {
      if (copiedAddress === address) copiedAddress = '';
    }, 2000);
  }
</script>

<ul class="support-wallets">
  {#each wallets as wallet (wallet.symbol)}
    <li class="support-wallets-item">
      <div class="support-wallets-row">
        <span class="support-wallets-symbol">{wallet.symbol}</span>
        <p class="support-wallets-address">{wallet.address}</p>
        <div class="support-wallets-actions">
          <button
            type="button"
            class="support-wallets-action"
            aria-label="Copy {wallet.name} address"
            on:click={() => copyAddress(wallet.address)}
          >
            {#if copiedAddress === wallet.address}
              <span in:fade={{ duration: 500 }}>copied</span>
            {:else}
              <span in:fade={{ duration: 500 }}>copy</span>
            {/if}
          </button>
          <button
            type="button"
            class="support-wallets-action"
            aria-expanded={openSymbol === wallet.symbol}
            aria-controls="support-qr-{wallet.symbol}"
            aria-label="QR code for {wallet.name}"
            on:click={() => toggleQr(wallet)}
          >
            qr
          </button>
        </div>
      </div>
      {#if openSymbol === wallet.symbol && qrData[wallet.symbol]}
        <div id="support-qr-{wallet.symbol}" class="support-wallets-qr">
          <img
            src={qrData[wallet.symbol]}
            alt="QR code for {wallet.name} address"
          />
        </div>
      {/if}
    </li>
  {/each}
</ul>
