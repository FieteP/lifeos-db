package com.lifeos.app;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;
import com.lifeos.apppicker.AppPickerPlugin;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        registerPlugin(AppPickerPlugin.class);
    }
}
