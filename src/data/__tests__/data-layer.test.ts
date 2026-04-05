import { describe, it, expect } from 'vitest';
import { siteMetadata, highlights } from '../site';
import { navLinks } from '../nav-links';
import { socialLinks, contactMethods } from '../social-links';
import { technologyCategories } from '../technologies';
import { experiences } from '../experience';
import { projects } from '../projects';
import { talks, interests } from '../talks';
import { education } from '../education';
import { certifications } from '../certifications';
import { languages } from '../languages';
import { cvMetadata } from '../cv-metadata';

// ─── Site metadata ────────────────────────────────────────────────────────────

describe('siteMetadata', () => {
  it('has required fields', () => {
    expect(siteMetadata.name).toBeTruthy();
    expect(siteMetadata.title).toBeTruthy();
    expect(siteMetadata.description).toBeTruthy();
    expect(siteMetadata.url).toBeTruthy();
    expect(siteMetadata.ogImage).toBeTruthy();
    expect(siteMetadata.locale).toBeTruthy();
  });

  it('url is a valid https URL', () => {
    expect(siteMetadata.url).toMatch(/^https?:\/\/.+/);
  });

  it('ogImage starts with /', () => {
    expect(siteMetadata.ogImage).toMatch(/^\//);
  });
});

describe('highlights', () => {
  it('is a non-empty array', () => {
    expect(Array.isArray(highlights)).toBe(true);
    expect(highlights.length).toBeGreaterThan(0);
  });

  it('every highlight has label, numericValue, and displayValue', () => {
    for (const h of highlights) {
      expect(h.label).toBeTruthy();
      expect(typeof h.numericValue).toBe('number');
      expect(h.displayValue).toBeTruthy();
    }
  });

  it('numericValue matches the numeric part of displayValue', () => {
    for (const h of highlights) {
      expect(h.displayValue).toContain(String(h.numericValue));
    }
  });
});

// ─── Navigation links ─────────────────────────────────────────────────────────

describe('navLinks', () => {
  it('is a non-empty array', () => {
    expect(Array.isArray(navLinks)).toBe(true);
    expect(navLinks.length).toBeGreaterThan(0);
  });

  it('every link has href and label', () => {
    for (const link of navLinks) {
      expect(link.href).toBeTruthy();
      expect(link.label).toBeTruthy();
    }
  });

  it('every href starts with # (section anchor)', () => {
    for (const link of navLinks) {
      expect(link.href).toMatch(/^#/);
    }
  });

  it('no duplicate hrefs', () => {
    const hrefs = navLinks.map((l) => l.href);
    const unique = new Set(hrefs);
    expect(unique.size).toBe(hrefs.length);
  });
});

// ─── Social links ─────────────────────────────────────────────────────────────

describe('socialLinks', () => {
  it('is a non-empty array', () => {
    expect(Array.isArray(socialLinks)).toBe(true);
    expect(socialLinks.length).toBeGreaterThan(0);
  });

  it('every link has name, href, and icon', () => {
    for (const link of socialLinks) {
      expect(link.name).toBeTruthy();
      expect(link.href).toBeTruthy();
      expect(link.icon).toBeTruthy();
    }
  });

  it('http(s) hrefs are valid URLs', () => {
    for (const link of socialLinks) {
      if (link.href.startsWith('http')) {
        expect(() => new URL(link.href)).not.toThrow();
      }
    }
  });
});

// ─── Contact methods ──────────────────────────────────────────────────────────

describe('contactMethods', () => {
  it('is a non-empty array', () => {
    expect(Array.isArray(contactMethods)).toBe(true);
    expect(contactMethods.length).toBeGreaterThan(0);
  });

  it('every method has name, value, href, and icon', () => {
    for (const method of contactMethods) {
      expect(method.name).toBeTruthy();
      expect(method.value).toBeTruthy();
      expect(method.href).toBeTruthy();
      expect(method.icon).toBeTruthy();
    }
  });

  it('http(s) hrefs are valid URLs', () => {
    for (const method of contactMethods) {
      if (method.href.startsWith('http')) {
        expect(() => new URL(method.href)).not.toThrow();
      }
    }
  });
});

// ─── Technology categories ────────────────────────────────────────────────────

describe('technologyCategories', () => {
  it('is a non-empty array', () => {
    expect(Array.isArray(technologyCategories)).toBe(true);
    expect(technologyCategories.length).toBeGreaterThan(0);
  });

  it('every category has a name and non-empty techs array', () => {
    for (const category of technologyCategories) {
      expect(category.name).toBeTruthy();
      expect(Array.isArray(category.techs)).toBe(true);
      expect(category.techs.length).toBeGreaterThan(0);
    }
  });

  it('every tech has a valid name and level', () => {
    const validLevels = ['Expert', 'Proficient', 'Familiar'];
    for (const category of technologyCategories) {
      for (const tech of category.techs) {
        expect(tech.name).toBeTruthy();
        expect(validLevels).toContain(tech.level);
      }
    }
  });
});

// ─── Experience ───────────────────────────────────────────────────────────────

describe('experiences', () => {
  it('is a non-empty array', () => {
    expect(Array.isArray(experiences)).toBe(true);
    expect(experiences.length).toBeGreaterThan(0);
  });

  it('every entry has required fields', () => {
    for (const exp of experiences) {
      expect(exp.title).toBeTruthy();
      expect(exp.company).toBeTruthy();
      expect(exp.location).toBeTruthy();
      expect(exp.period).toBeTruthy();
      expect(typeof exp.current).toBe('boolean');
      expect(exp.description).toBeTruthy();
      expect(Array.isArray(exp.achievements)).toBe(true);
      expect(Array.isArray(exp.tech)).toBe(true);
    }
  });

  it('at most one experience is marked as current', () => {
    const current = experiences.filter((e) => e.current);
    expect(current.length).toBeLessThanOrEqual(1);
  });
});

// ─── Projects ─────────────────────────────────────────────────────────────────

describe('projects', () => {
  it('is a non-empty array', () => {
    expect(Array.isArray(projects)).toBe(true);
    expect(projects.length).toBeGreaterThan(0);
  });

  it('every project has required fields', () => {
    for (const project of projects) {
      expect(project.title).toBeTruthy();
      expect(project.role).toBeTruthy();
      expect(project.summary).toBeTruthy();
      expect(Array.isArray(project.tech)).toBe(true);
      expect(project.tech.length).toBeGreaterThan(0);
    }
  });

  it('optional repoUrl and liveUrl are valid URLs when present', () => {
    for (const project of projects) {
      if (project.repoUrl) {
        expect(() => new URL(project.repoUrl!)).not.toThrow();
      }
      if (project.liveUrl) {
        expect(() => new URL(project.liveUrl!)).not.toThrow();
      }
    }
  });
});

// ─── Talks ────────────────────────────────────────────────────────────────────

describe('talks', () => {
  it('is a non-empty array', () => {
    expect(Array.isArray(talks)).toBe(true);
    expect(talks.length).toBeGreaterThan(0);
  });

  it('every talk has required fields', () => {
    for (const talk of talks) {
      expect(talk.title).toBeTruthy();
      expect(talk.event).toBeTruthy();
      expect(talk.year).toBeTruthy();
      expect(talk.description).toBeTruthy();
      expect(Array.isArray(talk.topics)).toBe(true);
      expect(talk.topics.length).toBeGreaterThan(0);
    }
  });

  it('year is a 4-digit string', () => {
    for (const talk of talks) {
      expect(talk.year).toMatch(/^\d{4}$/);
    }
  });
});

// ─── Interests ────────────────────────────────────────────────────────────────

describe('interests', () => {
  it('is a non-empty array of strings', () => {
    expect(Array.isArray(interests)).toBe(true);
    expect(interests.length).toBeGreaterThan(0);
    for (const interest of interests) {
      expect(typeof interest).toBe('string');
      expect(interest.length).toBeGreaterThan(0);
    }
  });
});

// ─── Education ────────────────────────────────────────────────────────────────

describe('education', () => {
  it('is a non-empty array', () => {
    expect(Array.isArray(education)).toBe(true);
    expect(education.length).toBeGreaterThan(0);
  });

  it('every entry has required fields', () => {
    for (const entry of education) {
      expect(entry.degree).toBeTruthy();
      expect(entry.institution).toBeTruthy();
      expect(entry.location).toBeTruthy();
      expect(entry.period).toBeTruthy();
      expect(entry.status).toBeTruthy();
    }
  });

  it('status is a valid value', () => {
    const validStatuses = ['completed', 'in-progress', 'incomplete'];
    for (const entry of education) {
      expect(validStatuses).toContain(entry.status);
    }
  });

  it('description, when present, is a non-empty string', () => {
    for (const entry of education) {
      if (entry.description !== undefined) {
        expect(typeof entry.description).toBe('string');
        expect(entry.description.length).toBeGreaterThan(0);
      }
    }
  });
});

// ─── Certifications ───────────────────────────────────────────────────────────

describe('certifications', () => {
  it('is an array', () => {
    expect(Array.isArray(certifications)).toBe(true);
  });

  it('every entry has name, issuer, and year', () => {
    for (const cert of certifications) {
      expect(cert.name).toBeTruthy();
      expect(cert.issuer).toBeTruthy();
      expect(cert.year).toBeTruthy();
    }
  });

  it('year is a 4-digit string', () => {
    for (const cert of certifications) {
      expect(cert.year).toMatch(/^\d{4}$/);
    }
  });

  it('url, when present, is a valid URL', () => {
    for (const cert of certifications) {
      if (cert.url !== undefined) {
        expect(() => new URL(cert.url!)).not.toThrow();
      }
    }
  });
});

// ─── Languages ────────────────────────────────────────────────────────────────

describe('languages', () => {
  it('is a non-empty array', () => {
    expect(Array.isArray(languages)).toBe(true);
    expect(languages.length).toBeGreaterThan(0);
  });

  it('every entry has name and level', () => {
    for (const lang of languages) {
      expect(lang.name).toBeTruthy();
      expect(lang.level).toBeTruthy();
    }
  });

  it('Español Nativo is present', () => {
    const espanol = languages.find((l) => l.name === 'Español' && l.level === 'Nativo');
    expect(espanol).toBeDefined();
  });
});

// ─── CV Metadata ──────────────────────────────────────────────────────────────

describe('cvMetadata', () => {
  it('has required fields', () => {
    expect(cvMetadata.title).toBeTruthy();
    expect(cvMetadata.summary).toBeTruthy();
    expect(cvMetadata.lastUpdated).toBeTruthy();
  });

  it('summary is at least 50 characters', () => {
    expect(cvMetadata.summary.length).toBeGreaterThanOrEqual(50);
  });

  it('lastUpdated matches YYYY-MM format', () => {
    expect(cvMetadata.lastUpdated).toMatch(/^\d{4}-\d{2}$/);
  });
});
