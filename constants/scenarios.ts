// Guided scenario definitions for the Architecture Scenario Engine

export type ScenarioId = 'campus' | 'branch' | 'stadium' | 'regional' | 'highrise';

export interface ScenarioGoal {
  metric: string;
  target: string | number;
  unit: string;
}

export interface Scenario {
  id: ScenarioId;
  title: string;
  description: string;
  context: string; // Business context
  deploymentSize: string;
  initialConfig: {
    sandboxAPs: number;
    sandboxInterference: 'low' | 'high';
    sandboxStandard: 'wifi6' | 'wifi7';
    sandboxFailure: 'none' | 'cloud' | 'wan' | 'controller';
  };
  goals: ScenarioGoal[];
  architectureNotes: {
    centralized: string; // What happens with centralized
    edge: string; // What happens with edge
  };
  learningPoints: string[];
}

export const SCENARIOS: Record<ScenarioId, Scenario> = {
  campus: {
    id: 'campus',
    title: 'Enterprise Campus: High Density',
    description: 'Your enterprise campus has grown to 200 APs across 5 buildings. Peak hours surge to 5,000 concurrent users. IT needs sub-10ms roaming latency and zero packet loss during handoffs.',
    context: 'Enterprise HQ with multiple buildings, high user density, demanding real-time applications (VoIP, video conferencing).',
    deploymentSize: '200 APs across 5 sites',
    initialConfig: {
      sandboxAPs: 200,
      sandboxInterference: 'low',
      sandboxStandard: 'wifi6',
      sandboxFailure: 'none',
    },
    goals: [
      { metric: 'Roaming Latency', target: '<10ms', unit: 'ms' },
      { metric: 'Packet Loss', target: '0%', unit: 'percent' },
      { metric: 'Controller CPU', target: '<60%', unit: 'percent' },
    ],
    architectureNotes: {
      centralized: 'Roaming decisions route through central controller. Latency spikes to 50-100ms. Controller CPU saturates. Some clients experience dropped calls during handoffs.',
      edge: 'Roaming happens locally at AP level. Latency stays <2ms. Each AP makes decisions autonomously. All calls remain clear.',
    },
    learningPoints: [
      'Scale is a killer for centralized architectures',
      'Controller latency directly impacts user experience',
      'Local decision-making scales linearly with APs',
    ],
  },
  
  branch: {
    id: 'branch',
    title: 'Branch Network: WAN Resilience',
    description: 'Your retail branch network spans 20 sites with 25 APs each. Last month, a WAN outage cut cloud connectivity for 4 hours. Branches went completely dark. How do you prevent this?',
    context: 'Multi-site retail or branch office deployment with cloud-hosted controller. Focus on autonomy and resilience during WAN failures.',
    deploymentSize: '20 sites × 25 APs (500 APs total)',
    initialConfig: {
      sandboxAPs: 25,
      sandboxInterference: 'low',
      sandboxStandard: 'wifi6',
      sandboxFailure: 'cloud',
    },
    goals: [
      { metric: 'Network Uptime During WAN Cut', target: '100%', unit: 'percent' },
      { metric: 'User Continuity', target: 'Zero interruption', unit: 'status' },
      { metric: 'Config Propagation', target: 'None needed', unit: 'status' },
    ],
    architectureNotes: {
      centralized: 'Cloud controller becomes unreachable. APs reboot or fall back to cached config. Users drop. Troubleshooting is blind. Recovery requires manual intervention.',
      edge: 'Local control plane continues unaffected. Roaming, policy, and client management work normally. Network remains fully operational while waiting for WAN restoration.',
    },
    learningPoints: [
      'Cloud dependency is a hidden SPoF',
      'Edge-native architectures survive WAN outages',
      'Autonomy = resilience at scale',
    ],
  },
  
  stadium: {
    id: 'stadium',
    title: 'Dense Venue: Spectrum Congestion',
    description: 'You\'re deploying Wi-Fi at a 70,000-seat stadium. 5GHz is jammed with neighboring networks. DFS radar hits force channel changes every few minutes. Can you deliver consistent coverage?',
    context: 'High-density public venue with severe RF congestion, radar interference, and dynamic spectrum sharing. Test Wi-Fi 6 vs Wi-Fi 7 MLO.',
    deploymentSize: '150 APs, high RF interference',
    initialConfig: {
      sandboxAPs: 150,
      sandboxInterference: 'high',
      sandboxStandard: 'wifi6',
      sandboxFailure: 'none',
    },
    goals: [
      { metric: 'Coverage Consistency', target: '>95%', unit: 'percent' },
      { metric: 'Latency During DFS Hits', target: '<20ms', unit: 'ms' },
      { metric: 'No Session Drops', target: '0', unit: 'events' },
    ],
    architectureNotes: {
      centralized: 'DFS channel changes cause blackouts. Controller must re-assign all clients. Roaming logic runs on WLC, adding latency. Thousands of clients experience brief disconnects.',
      edge: 'Wi-Fi 7 MLO enables seamless switching between 5GHz/6GHz. If 5GHz is blocked, streams move to 6GHz transparently. Users don\'t even notice DFS events.',
    },
    learningPoints: [
      'Wi-Fi 7 MLO is not just marketing—it\'s a technical requirement for dense venues',
      'Centralized channel steering adds latency',
      'Edge intelligence handles spectrum changes without global coordination',
    ],
  },
  
  regional: {
    id: 'regional',
    title: 'Regional Deployment: Fault Isolation',
    description: 'Your regional network spans 15 cities with 30 APs per city. One data center fails. In a centralized model, all 450 APs lose control. In an edge model, only that region\'s management plane hiccups. Compare the outcomes.',
    context: 'Geographically distributed network where regional data center failure should not cascade globally.',
    deploymentSize: '15 cities × 30 APs (450 APs total)',
    initialConfig: {
      sandboxAPs: 30,
      sandboxInterference: 'low',
      sandboxStandard: 'wifi6',
      sandboxFailure: 'controller',
    },
    goals: [
      { metric: 'Blast Radius on Mgmt Failure', target: '1 region', unit: 'count' },
      { metric: 'Data Plane Continuity', target: '100%', unit: 'percent' },
      { metric: 'MTTR', target: '<15 min', unit: 'minutes' },
    ],
    architectureNotes: {
      centralized: 'One central controller fails → entire network loses roaming, config, policy. Blast radius: all 450 APs. Recovery requires central failover or manual intervention.',
      edge: 'Regional controller fails → only that region\'s management plane goes down. Data forwarding continues 100%. Only roaming config updates are delayed. Blast radius: 30 APs.',
    },
    learningPoints: [
      'Centralized = global fault domain',
      'Edge architectures enable fault isolation',
      'Distributed control planes scale because failure is local',
    ],
  },
  
  highrise: {
    id: 'highrise',
    title: '40-Story Office Tower: Multi-Floor Coordination',
    description: 'A 40-story office building has 200 APs (5 per floor). Hundreds of users roam hourly between floors. Roaming delays cause dropped calls. The building is growing—can your architecture scale to 400 APs?',
    context: 'Multi-story enterprise building with high roaming frequency and ongoing expansion. Test how architecture scales with density.',
    deploymentSize: '40 floors × 5 APs (200 APs, scaling to 400)',
    initialConfig: {
      sandboxAPs: 200,
      sandboxInterference: 'low',
      sandboxStandard: 'wifi6',
      sandboxFailure: 'none',
    },
    goals: [
      { metric: 'Roaming Latency', target: '<5ms', unit: 'ms' },
      { metric: 'Controller Headroom (Scaling)', target: '>40%', unit: 'percent' },
      { metric: 'Consistency Across Density Growth', target: 'No degradation', unit: 'status' },
    ],
    architectureNotes: {
      centralized: 'At 200 APs, roaming latency is already 30-50ms. CPU is 70%. Adding 200 more APs saturates the controller. Roaming becomes unusable. Scaling requires expensive HA controllers.',
      edge: 'At 200 APs, roaming latency is <2ms. CPU across all APs stays ~10%. Adding 200 more APs scales linearly. No additional centralized hardware needed.',
    },
    learningPoints: [
      'Centralized architectures hit a scaling cliff',
      'Edge scales gracefully and linearly',
      'Controller CPU is a hidden cost at scale',
    ],
  },
};

export const SCENARIO_ORDER: ScenarioId[] = ['campus', 'branch', 'stadium', 'regional', 'highrise'];
