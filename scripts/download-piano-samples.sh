#!/bin/bash
# Script to download piano samples and rename them to note names
# MIDI note 21 = A0, MIDI note 108 = C8

OUTPUT_DIR="/home/charles/Dev/melora/static/audio/piano"

# Note names for octave 0-8 (semitones from C)
NOTE_NAMES=("C" "C#" "D" "D#" "E" "F" "F#" "G" "G#" "A" "A#" "B")

# Function to convert MIDI note to note name
midi_to_name() {
    local midi=$1
    local note_index=$((midi % 12))
    local octave=$((midi / 12 - 1))
    echo "${NOTE_NAMES[$note_index]}$octave"
}

echo "Creating output directory..."
mkdir -p "$OUTPUT_DIR"

echo "Downloading piano samples from CDN..."

# Download all 88 samples (rel1.mp3 to rel88.mp3)
# rel1 = MIDI 21 (A0), rel88 = MIDI 108 (C8)
for i in $(seq 1 88); do
    midi_note=$((i + 20))  # MIDI 21-108
    note_name=$(midi_to_name $midi_note)
    
    # Handle # in filename - replace with 's' for filesystem compatibility
    filename="${note_name/#\#/s}"
    
    url="https://unpkg.com/@audio-samples/piano-mp3-release@1.0.5/audio/rel${i}.mp3"
    output_file="$OUTPUT_DIR/${filename}.mp3"
    
    if [ ! -f "$output_file" ]; then
        echo "Downloading $note_name (rel${i}.mp3)..."
        curl -sL "$url" -o "$output_file"
    else
        echo "Skipping $note_name (already exists)"
    fi
done

echo "Done! Downloaded piano samples to $OUTPUT_DIR"
ls -la "$OUTPUT_DIR" | head -20
