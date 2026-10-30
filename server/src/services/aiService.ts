import { ComplaintPriority } from '../types.js';
import { store } from '../data/store.js';

export interface AIClassificationResult {
  suggestedCategory: string;
  confidence: number;
  suggestedPriority: ComplaintPriority;
  priorityRationale: string;
  suggestedDepartment: string;
  summary: string;
  suggestedNextAction: string;
  keywords: string[];
}

export interface AIDuplicateMatch {
  isDuplicateLikely: boolean;
  confidenceScore: number;
  matchingComplaintReference?: string;
  matchingComplaintTitle?: string;
  distanceMeters?: number;
}

export class AIService {
  // 1. Complaint Intelligence Classification
  static async classifyComplaint(title: string, description: string): Promise<AIClassificationResult> {
    const text = `${title} ${description}`.toLowerCase();

    let suggestedCategory = 'Other civic issues';
    let suggestedPriority: ComplaintPriority = 'medium';
    let priorityRationale = 'Standard civic concern requiring regular municipal inspection.';
    let suggestedDepartment = 'General Municipal Administration';
    let suggestedNextAction = 'Route to municipal desk for preliminary verification.';
    let confidence = 0.92;

    const keywords: string[] = [];

    // Water & Leakage
    if (text.includes('water') || text.includes('pipe') || text.includes('burst') || text.includes('leak') || text.includes('shortage')) {
      suggestedCategory = 'Water leakage and water supply';
      suggestedDepartment = 'Water Supply & Sewerage Board';
      keywords.push('potable water', 'pipeline', 'hydraulic pressure');
      if (text.includes('burst') || text.includes('flooding') || text.includes('million') || text.includes('zero pressure')) {
        suggestedPriority = 'critical';
        priorityRationale = 'High-pressure clean water loss with structural foundation risk.';
        suggestedNextAction = 'Immediate dispatch of isolation valve crew and emergency telemetry ping.';
        confidence = 0.98;
      } else {
        suggestedPriority = 'high';
        priorityRationale = 'Utility disruption affecting residential block consumption.';
        suggestedNextAction = 'Dispatch pipeline technician within 4 hours.';
      }
    }
    // Roads & Potholes
    else if (text.includes('pothole') || text.includes('road') || text.includes('asphalt') || text.includes('crater') || text.includes('pavement')) {
      suggestedCategory = 'Roads and potholes';
      suggestedDepartment = 'Roads & Infrastructure';
      keywords.push('asphalt', 'carriageway', 'pedestrian safety');
      if (text.includes('skid') || text.includes('accident') || text.includes('deep') || text.includes('artery')) {
        suggestedPriority = 'high';
        priorityRationale = 'Severe vehicular hazard with high probability of two-wheeler accidents.';
        suggestedNextAction = 'Deploy cold-mix asphalt quick-fill team and place safety cones.';
        confidence = 0.96;
      } else {
        suggestedPriority = 'medium';
        priorityRationale = 'Pavement wear requiring maintenance during scheduled road rounds.';
        suggestedNextAction = 'Add to weekly resurfacing route.';
      }
    }
    // Garbage & Waste
    else if (text.includes('garbage') || text.includes('waste') || text.includes('dump') || text.includes('trash') || text.includes('bin') || text.includes('odor')) {
      suggestedCategory = 'Garbage and waste management';
      suggestedDepartment = 'Waste & Sanitation Management';
      keywords.push('solid waste', 'sanitation', 'compactor truck');
      if (text.includes('hospital') || text.includes('toxic') || text.includes('hazard') || text.includes('2 meter')) {
        suggestedPriority = 'high';
        priorityRationale = 'Biochemical risk or large-scale alleyway obstruction.';
        suggestedNextAction = 'Dispatch municipal hydraulic compactor and sanitize site.';
      } else {
        suggestedPriority = 'medium';
        priorityRationale = 'Accumulated household or commercial refuse awaiting collection.';
        suggestedNextAction = 'Queue for morning sanitation truck route.';
      }
      confidence = 0.95;
    }
    // Streetlights & Electrical
    else if (text.includes('streetlight') || text.includes('light') || text.includes('dark') || text.includes('lamp') || text.includes('pole') || text.includes('electric') || text.includes('spark')) {
      if (text.includes('spark') || text.includes('wire') || text.includes('transformer')) {
        suggestedCategory = 'Electricity infrastructure';
        suggestedDepartment = 'Electrical & Streetlight Authority';
        suggestedPriority = 'critical';
        priorityRationale = 'Live electrical hazard posing electrocution or fire danger.';
        suggestedNextAction = 'Alert emergency grid operator to de-energize lines immediately.';
      } else {
        suggestedCategory = 'Streetlights';
        suggestedDepartment = 'Electrical & Streetlight Authority';
        suggestedPriority = 'high';
        priorityRationale = 'Unlit pedestrian corridor elevating nocturnal safety vulnerabilities.';
        suggestedNextAction = 'Inspect feeder breaker and replace lamp ballast.';
      }
      keywords.push('illumination', 'electrical grid', 'safety');
      confidence = 0.97;
    }
    // Drainage, Sewage & Flooding
    else if (text.includes('drain') || text.includes('sewage') || text.includes('clog') || text.includes('flood') || text.includes('waterlog')) {
      if (text.includes('flood') || text.includes('waterlog')) {
        suggestedCategory = 'Flooding and waterlogging';
        suggestedPriority = 'high';
        priorityRationale = 'Submerged traffic lane or underpass endangering commuters.';
        suggestedNextAction = 'Activate submersible de-watering pumps and clear intake grates.';
      } else {
        suggestedCategory = 'Drainage and sewage';
        suggestedPriority = 'high';
        priorityRationale = 'Sanitary overflow or blocked storm culvert posing health risks.';
        suggestedNextAction = 'Deploy vacuum desilting suction truck.';
      }
      suggestedDepartment = 'Water Supply & Sewerage Board';
      keywords.push('storm drainage', 'catch basin', 'sanitary line');
      confidence = 0.94;
    }
    // Traffic & Transit
    else if (text.includes('traffic') || text.includes('congestion') || text.includes('signal') || text.includes('jam') || text.includes('bus')) {
      suggestedCategory = 'Traffic and transportation';
      suggestedDepartment = 'Traffic & Urban Mobility Directorate';
      suggestedPriority = 'high';
      priorityRationale = 'Arterial transit bottleneck causing delay cascades across key nodes.';
      suggestedNextAction = 'Notify traffic police control room and adjust signal cycle.';
      keywords.push('mobility', 'transit corridor', 'signal timing');
      confidence = 0.93;
    }
    // Air and Noise Pollution
    else if (text.includes('pollution') || text.includes('smoke') || text.includes('noise') || text.includes('generator') || text.includes('smog')) {
      suggestedCategory = 'Air and noise pollution';
      suggestedDepartment = 'Environmental Protection & Green Space';
      suggestedPriority = 'medium';
      priorityRationale = 'Environmental guideline violation impacting resident health.';
      suggestedNextAction = 'Send pollution enforcement officer to conduct decibel and emission audit.';
      keywords.push('ambient AQI', 'decibel compliance', 'emissions');
      confidence = 0.91;
    }

    // Generate concise summary
    const words = description.split(' ').slice(0, 14).join(' ');
    const summary = `${title.trim()}. Key observation: ${words}${description.length > 80 ? '...' : ''}`;

    return {
      suggestedCategory,
      confidence,
      suggestedPriority,
      priorityRationale,
      suggestedDepartment,
      summary,
      suggestedNextAction,
      keywords
    };
  }

  // 2. Duplicate Detection
  static detectDuplicates(
    title: string, 
    description: string, 
    latitude: number, 
    longitude: number, 
    category: string
  ): AIDuplicateMatch {
    const existing = store.getComplaints();
    const cleanTokens = (str: string) => str.toLowerCase().replace(/[^a-z0-9 ]/g, '').split(/\s+/).filter(w => w.length > 3);
    const inputTokens = new Set([...cleanTokens(title), ...cleanTokens(description)]);

    for (const comp of existing) {
      if (comp.status === 'resolved' || comp.status === 'rejected') continue;

      // Distance calculation in meters (Haversine approx)
      const latDiff = Math.abs(comp.latitude - latitude) * 111000;
      const lonDiff = Math.abs(comp.longitude - longitude) * 111000 * Math.cos(latitude * Math.PI / 180);
      const distanceMeters = Math.sqrt(latDiff * latDiff + lonDiff * lonDiff);

      // Check category and distance
      if (distanceMeters < 300 || comp.category === category) {
        const compTokens = cleanTokens(`${comp.title} ${comp.description}`);
        let matchCount = 0;
        for (const t of compTokens) {
          if (inputTokens.has(t)) matchCount++;
        }

        const similarityRatio = matchCount / Math.max(inputTokens.size, 1);
        if (distanceMeters < 300 && similarityRatio > 0.35) {
          return {
            isDuplicateLikely: true,
            confidenceScore: Math.round(similarityRatio * 100),
            matchingComplaintReference: comp.reference_number,
            matchingComplaintTitle: comp.title,
            distanceMeters: Math.round(distanceMeters)
          };
        }
      }
    }

    return {
      isDuplicateLikely: false,
      confidenceScore: 0
    };
  }

  // 3. CityAssist AI Conversational Citizen Assistant
  static async chatWithCityAssist(query: string, user?: { name?: string; role?: string }): Promise<string> {
    const q = query.toLowerCase();

    // Reference ID lookup (e.g. SC360-2026-1041 or 1041)
    const refMatch = query.match(/SC360-2026-(\d+)/i) || query.match(/10\d{2}/);
    if (refMatch) {
      const targetId = refMatch[0].toUpperCase().startsWith('SC') ? refMatch[0].toUpperCase() : `SC360-2026-${refMatch[0]}`;
      const complaint = store.getComplaintById(targetId);
      if (complaint) {
        return `📋 **Complaint Record Found: ${complaint.reference_number}**\n\n` +
          `• **Title:** ${complaint.title}\n` +
          `• **Category:** ${complaint.category}\n` +
          `• **Current Status:** **${complaint.status.replace('_', ' ').toUpperCase()}**\n` +
          `• **Assigned Department:** ${complaint.assigned_department_name || 'Under Preliminary Review'}\n` +
          `• **Location:** ${complaint.location_name}\n` +
          `• **Filed On:** ${new Date(complaint.created_at).toLocaleDateString()} at ${new Date(complaint.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}\n\n` +
          (complaint.history && complaint.history.length > 0 
            ? `**Latest Progress Note:** "${complaint.history[complaint.history.length - 1].comment}"` 
            : `Our field team is actively reviewing your submission.`);
      } else {
        return `I checked our municipal records, but could not locate complaint reference **${targetId}**. Please verify the number or check the "My Complaints" tab on your Citizen Dashboard.`;
      }
    }

    // How to report a problem
    if (q.includes('how to report') || q.includes('report a problem') || q.includes('file a complaint') || q.includes('lodge complaint')) {
      return `### How to Report a Problem on SmartCity 360 🏙️\n\n` +
        `1. **Click "Report Problem"** in the top navigation or on your dashboard.\n` +
        `2. **Fill in the Title & Details:** Describe the civic issue clearly.\n` +
        `3. **Use "AI Auto-Fill":** Our AI will automatically predict the category, assign priority, and suggest the right department!\n` +
        `4. **Pick Location:** Pinpoint the problem on the interactive Leaflet map or enter a street address/landmark.\n` +
        `5. **Upload Photo:** Add a photo of the hazard for faster field verification.\n` +
        `6. **Submit & Track:** You'll immediately receive a unique reference ID (e.g., *SC360-2026-1045*) with live SMS/in-app updates at every stage!`;
    }

    // Water supply schedule
    if (q.includes('water') && (q.includes('schedule') || q.includes('timing') || q.includes('shortage') || q.includes('supply'))) {
      return `🚰 **SmartCity Municipal Water Supply Schedule (Mon–Sun)**\n\n` +
        `• **Ward 1 & 2 (Harbor & Coastal):** 05:30 AM – 08:30 AM | 06:00 PM – 08:00 PM\n` +
        `• **Ward 3 & 4 (Downtown & Central):** 06:00 AM – 09:30 AM | 07:00 PM – 09:30 PM\n` +
        `• **Ward 5 & 6 (Parkview & Greenfield):** 05:00 AM – 08:00 AM | 06:30 PM – 08:30 PM\n` +
        `• **Ward 7 (Highland Complex):** 06:30 AM – 10:00 AM\n\n` +
        `*Note: For low-pressure issues or emergency water tanker requests, submit a ticket under "Water leakage & water supply" or contact the Water Helpline: **+1-800-WATER-02**.*`;
    }

    // Waste and garbage segregation
    if (q.includes('waste') || q.includes('garbage') || q.includes('recycling') || q.includes('dustbin') || q.includes('trash')) {
      return `♻️ **City Waste Management & Segregation Guidelines**\n\n` +
        `• **Green Bin (Wet / Biodegradable):** Fruit peels, leftover food, tea leaves, garden cuttings, vegetable scraps.\n` +
        `• **Blue Bin (Dry / Recyclable):** Paper, cardboard, milk pouches, clean plastics, glass bottles, metal tins.\n` +
        `• **Red Bin (Hazardous / E-Waste):** Batteries, expired medicine, fluorescent bulbs, electronics, sanitary waste.\n\n` +
        `🚚 **Door-to-door collection runs daily from 07:00 AM to 11:30 AM.**\n` +
        `Smart bins with fill sensors automatically alert dispatchers when reaching 80% capacity.`;
    }

    // Emergency numbers
    if (q.includes('emergency') || q.includes('hospital') || q.includes('police') || q.includes('fire') || q.includes('ambulance') || q.includes('help line') || q.includes('helpline')) {
      return `🚨 **SmartCity 360 Verified Emergency Contacts**\n\n` +
        `• **Police Central Control:** 100 / 911\n` +
        `• **Fire Brigade & Disaster Rescue:** 101\n` +
        `• **Emergency Ambulance & Trauma:** 102 / 108\n` +
        `• **Municipal Disaster Management Cell:** 1077\n` +
        `• **Women Safety 24/7 Helpline:** 1091\n` +
        `• **Electric Hazard Rapid Shutdown:** +1-800-LIGHT-04\n` +
        `• **Water Pipeline Emergency:** +1-800-WATER-02\n\n` +
        `*All emergency services operate with GPS-enabled unified dispatch.*`;
    }

    // Dashboard statistics summary
    if (q.includes('statistic') || q.includes('summary') || q.includes('metrics') || q.includes('kpi') || q.includes('how many complaints')) {
      const summary = store.getDashboardSummary();
      return `📊 **Live SmartCity 360 Urban Performance Overview**\n\n` +
        `• **Total Registered Complaints:** ${summary.total}\n` +
        `• **Active In-Progress / Review:** ${summary.active}\n` +
        `• **Successfully Resolved:** ${summary.resolved} (${summary.resolution_rate}% resolution rate)\n` +
        `• **Critical Priority Issues:** ${summary.critical}\n` +
        `• **Average Resolution SLA:** ${summary.avg_resolution_hours} hours\n` +
        `• **Citizen Satisfaction Rating:** ⭐️ ${summary.satisfaction_score} / 5.0\n\n` +
        `You can explore the interactive analytics charts on the **City Dashboard**!`;
    }

    // Default intelligent greeting & capability guide
    return `Hello ${user?.name || 'Citizen'}! I am **CityAssist AI**, your 24/7 municipal smart city assistant.\n\n` +
      `Here are some things I can assist you with right now:\n` +
      `• 🔍 **Track Complaint Status:** Just type your reference ID (e.g., *SC360-2026-1041*)\n` +
      `• 📝 **Reporting Guidance:** Ask *"How do I report a pothole or water leak?"*\n` +
      `• 🚰 **Civic Schedules:** Ask *"What is the water supply timing for Ward 4?"*\n` +
      `• ♻️ **Sanitation:** Ask *"How should I segregate household waste?"*\n` +
      `• 🚨 **Emergency Contacts:** Ask *"Emergency helpline numbers"*\n` +
      `• 📊 **City Statistics:** Ask *"Show city complaint summary"*`;
  }
}
