import React, { useEffect, useState } from 'react';
import { Page, Header, Content } from '@backstage/core-components';
import { Octokit } from '@octokit/rest';
import ReactMarkdown from 'react-markdown';

const GITHUB_REPO_OWNER = 'your-github-username';
const GITHUB_REPO_NAME = 'your-repo-name';

export const GithubMarkdownDocsPage = () => {
  const [markdownFiles, setMarkdownFiles] = useState<string[]>([]);
  const [selectedFileContent, setSelectedFileContent] = useState<string | null>(null);

  useEffect(() => {
    const fetchFiles = async () => {
      const octokit = new Octokit({
        auth: process.env.GITHUB_TOKEN,
      });

      try {
        const { data } = await octokit.repos.getContent({
          owner: GITHUB_REPO_OWNER,
          repo: GITHUB_REPO_NAME,
          path: '',
        });

        if (Array.isArray(data)) {
          const mdFiles = data.filter((file: any) => file.name.endsWith('.md'))
                              .map((file: any) => file.name);

          setMarkdownFiles(mdFiles);
        } else {
          console.error('Unexpected data format:', data);
        }
      } catch (error) {
        console.error('Error fetching files:', error);
      }
    };

    fetchFiles();
  }, []);

  const fetchMarkdownContent = async (fileName: string) => {
    const octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN,
    });

    try {
      const { data } = await octokit.repos.getContent({
        owner: GITHUB_REPO_OWNER,
        repo: GITHUB_REPO_NAME,
        path: fileName,
      });

      if (data && !Array.isArray(data) && data.type === 'file' && data.content) {
        const content = atob(data.content);
        setSelectedFileContent(content);
      }
    } catch (error) {
      console.error('Error fetching content:', error);
    }
  };

  return (
    <Page themeId="documentation">
      <Header title="GitHub Markdown Docs" subtitle="Documentation from GitHub" />
      <Content>
        <div style={{ display: 'flex' }}>
          <aside style={{ width: '30%', padding: '1em', borderRight: '1px solid #ddd' }}>
            <ul>
              {markdownFiles.map((file) => (
                <li key={file}>
                  <button onClick={() => fetchMarkdownContent(file)}>{file}</button>
                </li>
              ))}
            </ul>
          </aside>
          <main style={{ padding: '1em' }}>
            { selectedFileContent ? (
              <ReactMarkdown>{selectedFileContent}</ReactMarkdown>
            ) : (
              <p>Select a file to view its content</p>
            ) }
          </main>
        </div>
      </Content>
    </Page>
  );
};