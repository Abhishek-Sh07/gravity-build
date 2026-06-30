import { notFound } from 'next/navigation'
import { PROJECTS, getProject } from '@/lib/projects'
import ProjectComingSoon from '@/components/ProjectComingSoon'

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const project = getProject(slug)
  if (!project) return { title: 'Project · Gravity Studio' }
  return {
    title: `${project.titleLines.join(' ')} · Gravity Studio`,
    description: project.intro,
  }
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const project = getProject(slug)
  if (!project) notFound()
  return <ProjectComingSoon project={project} />
}
