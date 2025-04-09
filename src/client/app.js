import runGas from './runGas.js';
import Alpine from 'alpinejs';
import './credits.js';
// @ts-ignore
window.Alpine = Alpine;

// @ts-ignore
Alpine.data('app', () => ({
  ready: 'Randomize Colors',
  loading: 'Loading...',
  isReady: true,
  serviceAccountKey: '',
  gcsBucketName: '',
  async runRandomize() {
    try {
      this.isReady = false;
      await runGas('randomizeCellColors');
    } catch (error) {
      console.error(error);
      alert(error);
    } finally {
      this.isReady = true;
    }
  },

  async exportJsonl() {
    try {
      this.isReady = false;
      await Promise.all([
        runGas('routeUploads', [['jsonl'], this.gcsBucketName, this.serviceAccountKey]),
        runGas('routeUploads', [['validationJsonl'], this.gcsBucketName, this.serviceAccountKey]),
      ]);
    } catch (err) {
      alert(`Update failed: ${err?.message || err}`);
    } finally {
      this.isReady = true;
    }
  },
}));

// @ts-ignore
Alpine.start();
