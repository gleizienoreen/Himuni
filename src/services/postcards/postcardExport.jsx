import { toPng } from 'html-to-image';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { PostcardCanvas } from '../../components/postcards/PostcardCanvas';

function slugify(text) {
  return (text || 'postcard')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
    .slice(0, 48);
}

/**
 * High-resolution PNG exporter for HIMUNI Sound Postcards.
 * Renders an isolated 1200x1500 canvas without relying on remote cross-origin images,
 * ensuring fast, safe, and dependable export.
 */
export async function exportPostcardAsPng(postcard, targetElement = null) {
  if (!postcard) {
    return { success: false, error: 'No postcard data provided.' };
  }

  const slug = slugify(postcard.title);
  const filename = `himuni-postcard-${slug}.png`;

  let container = null;
  let root = null;

  try {
    if (typeof document !== 'undefined' && document.fonts?.ready) {
      try {
        await document.fonts.ready;
      } catch {
        // ignore font ready errors
      }
    }

    let nodeToCapture = targetElement;

    if (!nodeToCapture) {
      // Create off-screen high-res container at 1200x1500 px
      container = document.createElement('div');
      container.style.position = 'fixed';
      container.style.left = '-9999px';
      container.style.top = '0';
      container.style.width = '1200px';
      container.style.height = '1500px';
      container.style.zIndex = '-100';
      container.style.pointerEvents = 'none';
      container.style.opacity = '1';
      document.body.appendChild(container);

      root = createRoot(container);
      root.render(
        <div style={{ width: '1200px', height: '1500px', fontSize: '24px' }}>
          <PostcardCanvas postcard={postcard} isExporting />
        </div>
      );

      // Wait a moment for fonts and layout to settle
      await new Promise((r) => setTimeout(r, 220));
      nodeToCapture = container.firstElementChild || container;
    }

    const dataUrl = await toPng(nodeToCapture, {
      pixelRatio: 2,
      cacheBust: true,
      quality: 0.95,
      filter: (node) => {
        // Exclude interactive player bars or external controls
        if (node.tagName === 'BUTTON' && node.getAttribute('aria-label')?.includes('Listen')) {
          return false;
        }
        return true;
      },
    });

    // Trigger download
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    link.click();

    return { success: true, filename };
  } catch (err) {
    return {
      success: false,
      error: err?.message || 'Failed to export postcard image.',
    };
  } finally {
    if (root) {
      try {
        root.unmount();
      } catch {
        // ignore unmount errors
      }
    }
    if (container && container.parentNode) {
      container.parentNode.removeChild(container);
    }
  }
}
