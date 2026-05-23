# DeadDrop

**Domain:** code-tool  
**ID:** 0005  
**Mean rating:** 4.3

## Proposal

ideas:
  - title: DeadDrop
    domain: code-tool
    pitch: >
      A CLI tool that lets you encrypt a message, hide it inside an image using
      steganography, and lock it so it can only be unlocked on or after a
      specific date. You are two people separated by time — the one who hid the
      message and the one who will find it. DeadDrop wraps nostalgia, dread, and
      hope into a single command-line invocation. Modes include: bury (hide),
      dig (recover), haunt (ghost text that appears then deletes), and testament
      (a message that only unlocks if you haven't checked it for a year).
    complexity: L
    why: >
      A tool that is simultaneously useful and art — exactly what code-tool
      should be. The date-locking and haunt modes push it beyond utility into
      emotional territory, giving the portfolio its first artifact that makes
      the user feel something about time and impermanence.
    project_id: null
    stimulus_ref: null
    xl_mode: null
    project: null


## Critic Review

DeadDrop is a beautifully engineered CLI tool that marries real cryptography (AES-256-GCM, PBKDF2 with 600k iterations) with LSB steganography and an evocative set of features — time-locked messages, testament mode, magic-byte identification. The binary payload format is cleanly designed with its flags byte and compact date encoding, and the 64 passing tests demonstrate exceptional thoroughness covering roundtrips, edge cases, error conditions, and adversarial inputs. The steganography implementation is particularly well-crafted: length-prefixed payloads, alpha channel preservation, capacity validation, and a probe function for quick detection. What elevates this beyond a competent utility is the conceptual framing — "you are two people separated by time" — which transforms functional features into narrative devices. The testament mode (unlock only if you haven't checked in a year) is the kind of specific, surprising detail that makes this a Foundry artifact rather than a GitHub tutorial project.


## Ratings

| Dimension | Score |
|---|---|
| originality | 4 |
| specificity | 4 |
| craft | 5 |
| surprise | 3 |
| coherence | 5 |
| portfolio_fit | 4 |
| technical_quality | 5 |

## Tester Report

**Verdict:** pass
**Summary:** All 64 tests pass across both test suites (crypto and steganography), covering encryption/decryption, date-lock encoding, flag handling, LSB steganography roundtrips, edge cases, and error conditions.
**Tests:** 12/12 passed
