# Quill Editor Test Project

A simple project to test Quill Editor integration with Next.js 14 and React 18.

## Features

- Next.js 14 with App Router
- React 18
- TypeScript
- Tailwind CSS
- Quill Editor integration
- Live preview of editor content
- HTML output display

## Getting Started

### Prerequisites

- Node.js 18.17 or later

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/editor-library-test.git
cd editor-library-test
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `src/components/QuillEditor.tsx` - The Quill editor component
- `src/app/editor/page.tsx` - The editor page with live preview
- `src/app/page.tsx` - The home page with a link to the editor

## Implementation Details

The Quill editor is implemented using the `react-quill` package. It's dynamically imported to avoid SSR issues in Next.js. The editor includes:

- Rich text formatting options
- Live preview of the content
- Display of the HTML output

## License

This project is licensed under the MIT License.
