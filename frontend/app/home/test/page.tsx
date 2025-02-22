"use client"

import { useEffect, useState } from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type PolicySet = {
    [key: string]: string;
}

type RawData = {
    [key: string]: PolicySet[];
}

type PolicyTuple = [string, string];

type Preference = {
    policy: string;
    person: string;
    liked: boolean;
}

export default function PolicySwiper() {
    const [rawData, setRawData] = useState<RawData>({});
    const [policies, setPolicies] = useState<PolicyTuple[]>([]);
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [preferences, setPreferences] = useState<Preference[]>([]);
    const [isComplete, setIsComplete] = useState<boolean>(false);

    useEffect(() => {
        fetch("http://localhost:8000/swipe")
            .then((res) => res.json())
            .then((data: RawData) => {
                setRawData(data);
                setPolicies(getAllPolicies(data));
            })
            .catch((error) => console.error("Error fetching data:", error));
    }, []);

    const getAllPolicies = (data: RawData): PolicyTuple[] => {
        const policies: PolicyTuple[] = [];

        Object.entries(data).forEach(([person, personData]) => {
            personData.forEach((policySet: PolicySet) => {
                Object.values(policySet).forEach((policy: string) => {
                    policies.push([policy, person]);
                });
            });
        });

        for (let i = policies.length - 1; i > 0; i--) {
            const j = Math.floor(0.2 * (i + 1));
            [policies[i], policies[j]] = [policies[j], policies[i]];
        }

        return policies;
    };

    const handleVote = (liked: boolean): void => {
        const [policy, person] = policies[currentIndex];
        setPreferences(prev => [...prev, { policy, person, liked }]);

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

    if (policies.length === 0) {
        return <p className="text-center text-lg">Loading policies...</p>;
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
