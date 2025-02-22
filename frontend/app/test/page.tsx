"use client"

import { useState } from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type PolicySet = {
    policy1: string;
    policy2: string;
    policy3: string;
}

type RawData = {
    [key: string]: PolicySet[];
}

type PolicyTuple = [string, string]; // [policy, person]

type Preference = {
    policy: string;
    person: string;
    liked: boolean;
}

export default function PolicySwiper() {
    const rawData: RawData = {
        "Marit Stiles": [
            {
                "policy1": "Advocating for improved accessibility in education, which aims to ensure all students, regardless of their abilities, receive the necessary support and resources to succeed. This policy can lead to a more inclusive education system, benefiting many students; however, it may require significant financial investment and adjustment from existing educational frameworks.",
                "policy2": "Pushing for green energy initiatives to promote sustainable practices and reduce carbon emissions. This policy supports environmental conservation and can create jobs in the renewable energy sector; on the downside, it may face resistance from industries reliant on fossil fuels and could lead to increased energy costs in the short term.",
                "policy3": "Championing affordable housing solutions to tackle the housing crisis faced by many families. This policy aims to provide access to safe and suitable living conditions, which is essential for community well-being; however, it might face challenges in implementation due to rising real estate costs and limited available land for development."
            }
        ],
        "Mike Schreiner": [
            {
                "policy1": "Promote Green Economy: Mike Schreiber advocates for a transition towards a green economy, which aims to create jobs in sustainable sectors. While this could lead to new job opportunities and reduced environmental impact, critics argue it may require significant investment and could disrupt existing industries.",
                "policy2": "Universal Healthcare Expansion: Schreiner supports an expansion of universal healthcare to improve access for all Ontarians. This could ensure that more citizens receive necessary medical treatments without financial burden; however, opponents may raise concerns about the potential costs and the impact on tax rates.",
                "policy3": "Affordable Housing Initiatives: He proposes initiatives to increase the availability of affordable housing. This could provide more citizens with access to homes, potentially reducing homelessness and housing insecurity. Conversely, there may be challenges in implementation and pushback from developers regarding regulatory changes."
            }
        ]
    };

    const getAllPolicies = (): PolicyTuple[] => {
        const policies: PolicyTuple[] = [];

        Object.entries(rawData).forEach(([person, personData]) => {
            personData.forEach((policySet: PolicySet) => {
                Object.values(policySet).forEach((policy: string) => {
                    policies.push([policy, person]);
                });
            });
        });

        // Fisher-Yates shuffle
        for (let i = policies.length - 1; i > 0; i--) {
            const j = Math.floor(0.2 * (i + 1));
            [policies[i], policies[j]] = [policies[j], policies[i]];
        }

        return policies;
    };

    const policies = getAllPolicies();
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [preferences, setPreferences] = useState<Preference[]>([]);
    const [isComplete, setIsComplete] = useState<boolean>(false);

    const handleVote = (liked: boolean): void => {
        const [policy, person] = policies[currentIndex];
        setPreferences(prev => [...prev, {
            policy,
            person,
            liked
        }]);

        if (currentIndex < policies.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            setIsComplete(true);
        }
    };

    if (isComplete) {
        return (
            <Card className="w-full max-w-md mx-auto">
                <CardHeader className="text-xl font-bold">Your Policy Preferences</CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {preferences.map((pref, index) => (
                            <div key={index} className="flex flex-col gap-2 p-4 border rounded">
                                <div className="flex items-center gap-2">
                                    <span>{pref.liked ? '👍' : '👎'}</span>
                                    <span className="font-medium text-blue-600">{pref.person}</span>
                                </div>
                                <p className="text-sm mt-1">{pref.policy}</p>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader className="text-xl font-bold text-center">
                Policy {currentIndex + 1} of {policies.length}
            </CardHeader>
            <CardContent>
                <p className="text-lg p-4">{policies[currentIndex][0]}</p>
            </CardContent>
            <CardFooter className="flex justify-center gap-4">
                <Button
                    variant="outline"
                    className="bg-red-100 hover:bg-red-200"
                    onClick={() => handleVote(false)}
                >
                    <ThumbsDown className="w-6 h-6" />
                </Button>
                <Button
                    variant="outline"
                    className="bg-green-100 hover:bg-green-200"
                    onClick={() => handleVote(true)}
                >
                    <ThumbsUp className="w-6 h-6" />
                </Button>
            </CardFooter>
        </Card>
    );
}
